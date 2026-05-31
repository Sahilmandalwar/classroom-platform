import Message from "../models/Message.js";
import Classroom from "../models/Classroom.js";
import {getIO} from "../socket.js";
export const sendMessage = async(req, res)=> {
    try{
        const {classroomId} = req.params;
        const {message} = req.body;
        const classroom = await Classroom.findOne({
            _id : classroomId,
            $or : [
                {
                    teacher : req.user.id,
                },
                {
                    students : req.user.id,
                }
            ]
        });
        if(!classroom) {
            return res.status(403).json({
                message : "unauthorised request",
            })
        }

        const newMessage = await Message.create({
            classroom : classroomId,
            sender : req.user.id,
            message : message
        });
        await newMessage.populate("sender", "name email");

        const io = getIO();

        io.to(classroomId).emit("messageSent",{
            message : `Message sent in classroom : ${classroom.title}`,
            newMessage,
        })
        
        res.status(200).json({
            message : "Message created successfully",
            newMessage,
        })

    }catch(error) {
        res.status(500).json({
            message : `Internal error occured : ${error.message}`,

        })
    }
}


export const getClassroomMessage=async(req,res)=>{
    try{
        const {classroomId} = req.params;
        const classroom = await Classroom.findOne({
            _id : classroomId,
            $or : [
                {
                    teacher : req.user.id,
                },
                {
                    students : req.user.id,
                }
            ]
        });
         if(!classroom) {
            return res.status(403).json({
                message : "unauthorised request",
            })
        }

        const messages = await Message.find({
            classroom : classroomId,
        }).populate("sender","name email").sort({createdAt: 1});

    

      
        res.status(200).json({
            message : "classroom all messages are fetched",
            messages
        })



    }catch(error) {
        res.status(500).json({
            message : `Internal error occured : ${error.message}`,
            
        })
    }
}