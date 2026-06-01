import Classroom from "../models/Classroom.js";
import {getIO} from '../socket.js';
export const createClassroom = async(req, res) => {
    try{
        const {title, description} = req.body;
        if(!title) {
            return res.status(400).json({
                message: "title is required",
            })
        }
        
        const classCode = Math.random()
            .toString(36)
            .substring(2,8)
            .toUpperCase();

        const classroom = await Classroom.create({
            title, description, classCode,
            teacher : req.user.id,
            students : [],
        });

        const io = getIO();
        io.to(req.user.id).emit("newClassroomAdded", {
            classroom
        });

        res.status(200).json({
            message : "classroom created successfully",
            classroom
        })
    }catch(error) {
        console.log(error);
        res.status(500).json({
            message : `server error`,
        })
    }
}

export const joinClassroom = async(req, res) => {
    try{
        const {classCode} = req.body;

        if(!classCode) {
            return res.status(400).json({
                message : "Class Code is required",
            })
        }

        const classroom = await Classroom.findOne({classCode});

        if(!classroom) {
            return res.status(404).json({
                message: "classroom not found",
            })
        }

        if(classroom.students.includes(req.user.id)) {
            return res.status(400).json({
                message: "student already present in classroom",
            })
        }

        classroom.students.push(req.user.id);
        await classroom.save();

        res.status(200).json({
            message: "Joined classroom succefully.",
            classroom
        })
    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
}

export const getMyClassroom = async(req, res) => {
    try{
        const classrooms = await Classroom.find({
            $or:[
                {teacher: req.user.id  },
                {students : req.user.id }
            ]
        }).populate("teacher", "name email");

        res.status(200).json({
            classrooms
        })
    }catch(error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
}

export const fetchClassroom = async(req,res)=>{
    
    try{
        const {classId} = req.params;
        const classroom = await Classroom.findOne({
            _id : classId,
            $or : [
                {teacher : req.user.id},
                {students : req.user.id},
            ]
        }).populate("teacher","name email")
        .populate("students", "name email");
        
        if(!classroom) {
            return res.status(400).json({
                message : "specified classroom not found",
            })
        }
       
        res.status(200).json({
            message: "Classroom information fetched successfully",
            classroom
        })


    }catch(error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
}

