import Announcement from "../models/Announcement.js";
import Classroom from "../models/Classroom.js";
import Notification from "../models/Notification.js";

import { getIO } from "../socket.js";

export const createAnnouncement = async(req, res) => {
    try {
        const {title, message, classroomId} = req.body;
        const classroom = await Classroom.findById(classroomId);

        if(!classroom) {
            return res.status(400).json({
                message: "Classroom not found",
            })
        }

        if(classroom.teacher.toString() !== req.user.id) {
            return res.status(403).json({
                message : "Unauthorized request",
            })
        }

        const postedBy = req.user.id;

        const announcement = await Announcement.create({
            title,
            message,
            postedBy,
            classroom: classroomId
        });
        await announcement.populate("postedBy", "name");
        
        const notifications = classroom.students.map((student)=>({
            
            receiver : student,
            sender : req.user.id,
            classroom : classroomId,
            type : 'announcement',
            message : `New announcement posted in ${classroom.title}`,
            isRead : false,
        }))

        await Notification.insertMany(notifications);


        const io = getIO();

        notifications.forEach((notification)=>{
            io.to(notification.receiver.toString()).emit("annoucementNotification",{
                notification,
                message : "notification received"
            })
        })
        io.to(classroomId).emit("newAnnouncement", {
            message : "new Announcment Posted",
            announcement
        })

        res.status(201).json({
            message : "announcment created successfully",
            announcement
            
        })

    }catch(error) {
        res.status(500).json({
            message : error.message,
        })
    }
}

export const getClassroomAnnouncement = async(req, res) => {
    try {
        const {classId} = req.params;
        const classroom = await Classroom.findById(classId);
        if(!classroom) {
            return res.status(400).json({
                message: "classroom not found",
            })
        }

        const isMember = await Classroom.exists({
            _id: classId,
            $or : [
                {teacher : req.user.id},
                {students : req.user.id}
            ]
        })
        if(!isMember) {
            return res.status(403).json({
                message : "unauthorised access",
            })
        }

        const announcements = await Announcement.find({"classroom" : classId})
                    .populate("postedBy", "name email")
                    .sort({"createdAt" : -1});

        res.status(200).json({
            message : "Announcement fetch successfully.",
            announcements
        })

    }catch(error) {
        res.status(500).json({
            message : error.message,
        })
    } 
}

export const deleteAnnouncement = async(req, res)=> {
    try{
        const {announcementId} = req.params;
       
        const announcement = await Announcement.findById(announcementId);
        if(!announcement) {
            return res.status(404).json({
                message: "Announcement does not exits",
            })
        }
        const classroomId = announcement.classroom;
        const classroom = await Classroom.findById(classroomId);
        
        const authorized = await Classroom.exists({
            _id : classroomId,
            teacher : req.user.id
        });

        if(!authorized) {
            return res.status(403).json({
                message: "Unauthorized access",
            })
        }
        
        await Announcement.deleteOne({_id: announcementId});
        const io = getIO();
        io.emit("deletedAnnouncement",{
            message : "Announcement was deleted",
            deletedAnnouncement : announcement
            
        })

        res.status(200).json({
            message: "announcement deleted successfully",
        })
        

    }catch(error) {
        res.status(500).json({
            message : error.message,
        })
    } 
}
