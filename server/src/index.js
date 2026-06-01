// import dotenv from 'dotenv';
// dotenv.config();

import 'dotenv/config';

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import classroomRoutes from "./routes/classroomRoute.js";
import announcementRoutes from './routes/announcementRoute.js';
import sessionRoutes from "./routes/sessionRoute.js";
import notesRoutes from "./routes/notesRoute.js";
import attendenceRoutes from "./routes/attendenceRoute.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket.js";
import notificationRoutes from "./routes/notificationRoute.js";
import messageRoutes from "./routes/messageRoute.js";


const port = process.env.PORT || 5000;

const app = express();
const httpServer = createServer(app);
const classroomOnlineUsers = new Map();

connectDB()

app.use(cors({
   origin: process.env.CLIENT_URL,
   credentials: true
}));
app.use(express.json());

app.use('/v1/api/auth',authRoutes);
app.use('/v1/api/classroom', classroomRoutes);
app.use("/v1/api/announcement", announcementRoutes);
app.use("/v1/api/session", sessionRoutes);
app.use("/v1/api/notes", notesRoutes);
app.use("/v1/api/attendance", attendenceRoutes);
app.use("/v1/api/notification", notificationRoutes);
app.use("/v1/api/message", messageRoutes);

const io = initSocket(
  new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST", "PATCH", "DELETE"],
    },
  })
);

io.on("connection", (socket) => {

  socket.on("joinUserRoom", (userId) => {
    socket.join(userId);
  });

  socket.on("joinClassRoom", ({ classId, userId }) => {
    // 1. Attach data to the socket itself so we remember who this is if they disconnect unexpectedly
    socket.currentClassId = classId;
    socket.currentUserId = userId;

    if (!classroomOnlineUsers.has(classId)) {
      classroomOnlineUsers.set(classId, new Set());
    }

    socket.join(classId);
    classroomOnlineUsers.get(classId).add(userId);

    // Broadcast the new count
    io.to(classId).emit("ClassroomOnlineUsers", classroomOnlineUsers.get(classId).size);
  });

  socket.on("leaveClassroomRoom", ({ classId, userId }) => {
    socket.leave(classId);
    
    // Safely check if the class exists in the map before trying to delete
    if (classroomOnlineUsers.has(classId)) {
      classroomOnlineUsers.get(classId).delete(userId);
      
      // Tell the frontend someone left!
      io.to(classId).emit("ClassroomOnlineUsers", classroomOnlineUsers.get(classId).size);
    }
    
  });

  socket.on("typing", ({ classId, userName }) => {
    socket.to(classId).emit("userTyping", { userName });
  });

  socket.on("stopTyping", ({ classId }) => {
    socket.to(classId).emit("userStoppedTyping");
  });

  // --- NEW DISCONNECT LOGIC ---
  socket.on("disconnect", () => {
    // 2. If they just closed the tab, use the attached data to clean them out of the Set
    if (socket.currentClassId && socket.currentUserId) {
      const classId = socket.currentClassId;
      const userId = socket.currentUserId;

      if (classroomOnlineUsers.has(classId)) {
        classroomOnlineUsers.get(classId).delete(userId);
        
        // Broadcast the updated count to everyone still in the room
        io.to(classId).emit("ClassroomOnlineUsers", classroomOnlineUsers.get(classId).size);
        
        // Optional: Keep the map clean by removing empty classes
        if (classroomOnlineUsers.get(classId).size === 0) {
          classroomOnlineUsers.delete(classId);
        }
      }
    }
  });
});



app.get("/",(req, res)=>{
    res.send("Welcome To Classroom Platform");
})

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});