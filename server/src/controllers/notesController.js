import Notes from '../models/Notes.js';
import Classroom from '../models/Classroom.js';
import { getIO } from '../socket.js';
import Notification from '../models/Notification.js';

export const uploadNotes = async(req,res) =>{
    try{
        const {title, description} = req.body;
    
        const {classroomId} = req.params;
        const createdBy = req.user.id;

        const file = req.file;
     

        if(!title || !file) {
            return res.status(400).json({
                message: "required fields missing",
            })
        }

        const classroom = await Classroom.findOne({
            _id: classroomId,
            teacher : createdBy
        })

        if(!classroom) {
            return res.status(403).json({
                message : "unauthorised access",
            })
        }

        const notes = await Notes.create({
            title, description,
            fileUrl: file.secure_url,
            classroom : classroomId,
            createdBy
        })



        await notes.populate("createdBy", "name email");

        const notifications = classroom.students.map((studentId)=>({
            receiver : studentId,
            sender : req.user.id,
            classroom : classroomId,
            type : 'notes',
            message : `notes uploaded in ${classroom.title}`,
            isRead : false,
        }))

        await Notification.insertMany(notifications);

        const io = getIO()
        
        notifications.forEach((notification)=>{
            io.to(notification.receiver.toString()).emit("notesNotification",{
                notification,
                message : "notification received"
            })
        })
        io.to(classroomId).emit("uploadedNotes", {
            message : "new notes uploaded",
            notes
        })




        res.status(201).json({
            message : "Notes uploaded successfully",
            notes
        })



    }catch(error){
        console.log(error);
        console.log(error?.message)
        res.status(500).json({
            message: "Server Error",
        });
    }
}

export const getClassroomNotes = async(req, res) => {
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
    
            const notes = await Notes.find({
                classroom : classroomId,
            }).sort({createdAt : -1})
            .populate("createdBy","name email")
    
            res.status(200).json({
                message : "fetched all notes",
                notes,
            })
    
        }catch(error) {
            console.log(error);
            res.status(500).json({
                message: "Server Error",
            });
        }
}

export const deleteNotes = async(req, res) => {
    try {
        const {noteId} = req.params;

        
        const notes = await Notes.findOne({
            _id: noteId,
            createdBy : req.user.id,
        });

        if(!notes) {
            return res.status(403).json({
                message : 'unauthorised request',
            })
        }

        await Notes.findByIdAndDelete(noteId);

        const io = getIO();
        io.emit("deletedNotes", {
            message : 'notes Deleted',
            deletedNotes : notes,
        })
        res.status(200).json({
            message: 'notes deleted succefully',
        })



    }catch(error){

    }
}