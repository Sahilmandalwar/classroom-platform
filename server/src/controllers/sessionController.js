import Session from "../models/Session.js";
import Classroom from "../models/Classroom.js";
import { getIO } from "../socket.js";
import Notification from "../models/Notification.js";

export const createSession = async(req, res) => {
    try{
        const {title, description, meetingLink, scheduledAt} = req.body;

        if(!title || !meetingLink || !scheduledAt) {
            return res.status(400).json({
                message: "required fields missing",
            })
        }

        const {classroomId} = req.params;

        const createdBy = req.user.id;

        const classroom = await Classroom.findOne({
            _id: classroomId,
            teacher : createdBy
        })

        if(!classroom) {
            return res.status(403).json({
                message : "unauthorised access",
            })
        }

        const session = await Session.create({
            title, description, meetingLink, scheduledAt,
            classroom: classroomId,
            createdBy
        })

        const notifications = classroom.students.map((studentId)=>({
            receiver : studentId,
            sender : req.user.id,
            classroom : classroomId,
            type : 'session',
            message : `New session created in ${classroom.title}`,
            isRead : false
        }))

        await Notification.insertMany(notifications);

        const io = getIO();
         notifications.forEach((notification)=>{
            io.to(notification.receiver.toString()).emit("sessionNotification",{
                notification,
                message : "notification received"
            })
        })
        io.to(classroomId).emit("newSession", {
            message : "new Session created",
            session
        })


     

        res.status(201).json({
            message: "Session created successfully",
            session,
        })

    }catch(error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
}

export const getClassroomSessions = async(req, res) => {
    try {
        const {classroomId} = req.params;
        const user = req.user.id;

        const classroom = await Classroom.exists({
            _id: classroomId,
            $or: [
                {teacher : user},
                {students : user}
            ]
        })

        if(!classroom){
            return res.status(403).json({
                message : "unauthorised access",
            })
        }

        const sessions = await Session.find({
            classroom : classroomId,
        }).sort({scheduledAt : -1})
        .populate("createdBy","name email")

        res.status(200).json({
            message : "fetched all sessions",
            sessions,
        })

    }catch(error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
}

export const deleteSession = async(req,res)=>{
    try{
        const {sessionId} = req.params;
        const session = await Session.exists({
            _id: sessionId,
            createdBy : req.user.id
        })
        if(!session) {
            return res.status(403).json({
                message : 'unauthorised request',
            })
        }
        const deletedSession = await Session.findByIdAndDelete(sessionId);

        const io = getIO();

        io.emit("deletedSession",{
            message : "deleted a session",
            session
        })
        
        res.status(200).json({
            message: "deleted session successfully",
            deletedSession
        })
    }catch(error) {
        console.log(error);
        
        res.status(500).json({
            message: "Server Error",
        });
    }
}

