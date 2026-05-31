import Classroom from "../models/Classroom.js";
import Attendance from "../models/Attendence.js";
import Session from "../models/Session.js";

export const markAttendance = async(req, res) => {
   try {
    const {sessionId, records} = req.body;

    const session = await Session.findById(sessionId);
    if(!session) {
        return res.status(404).json({
            message: "Session not found"
        });
    }

    const classroom = await Classroom.findById(session.classroom);
    if(!classroom) {
        return res.status(404).json({
            message: "Classroom not found"
        });
    }

    if(classroom.teacher.toString() !== req.user.id) {
        return res.status(403).json({
        message: "Only teacher can mark attendance"
        });
    }

    const classroomStudentIds = classroom.students.map(
        (student) => student.toString()
    );

    const invalidStudent = records.find(
        (record) => !classroomStudentIds.includes(record.studentId),
    );

    if(invalidStudent) {
        return res.status(400).json({
            message: "Some students do not belong to this classroom"
        });
    }

    const validStatuses = ["present", "absent"];

    const invalidStatus = records.find(
        (record) => !validStatuses.includes(record.status)
        );

    if(invalidStatus){
        return res.status(400).json({
            message: "Invalid attendance status"
        });
    }

    const operations = records.map((record)=>({
        updateOne: {
            filter : {
                session: sessionId,
                student : record.studentId
            },

            update : {
                $set : {
                    classroom : classroom._id,
                    student : record.studentId,
                    session : sessionId,
                    markedBy : req.user.id,
                    status: record.status,
                }
            },
            upsert : true
        }
    }));

    await Attendance.bulkWrite(operations);

    const updatedAttendance = await Attendance.find({
        session: sessionId
    }).populate("student", "name email");


    return res.status(200).json({
        message: "Attendance marked successfully",
        updatedAttendance
       
    });
   } catch(error) {
      return res.status(500).json({
         message: error.message, 
        
      })
   }
}

export const getSessionAttendance = async(req, res) => {
    try {
        const {sessionId} = req.params;

        const session = await Session.findById(sessionId);

        if(!session) {
            return res.status(404).json({
                message : "Session not found",
            })
        }

        const classroom = await Classroom.findById(session.classroom);

        if(!classroom) {
            return res.status(404).json({
                message : "Classroom not found",
            })
        }

        if(classroom.teacher.toString() !== req.user.id) {
            return res.status(403).json({
                message : "unauthorised request",
            })
        }

        

        const attendance = await Attendance.find({session : sessionId}).populate("student", "name email");

        if(attendance.length === 0) {
            return res.status(404).json({
                message: "Attendance record not found",
            })
        }

        res.status(200).json({
            message : "fetch Attendance successfully",
            attendance
        })


    }catch(error) {
      return res.status(500).json({
         message: error.message, 
        
      })
   }
}

export const getMyAttendance = async(req, res) => {
    try {
        const {classId} = req.params;

        const authorised = await Classroom.exists({
            _id : classId,
            students : req.user.id,
        })

        if(!authorised) {
            return res.status(403).json({
                message : "Unauthorised access",
            })
        }

        const attendance = await Attendance.find({
            classroom : classId,
            student : req.user.id,
        }).populate("session", "title").sort({createdAt: -1})

        res.status(200).json({
            message : "fetch all attendance of classroom sucessfully",
            attendance
        })

    }catch(error) {
      return res.status(500).json({
         message: error.message, 
        
      })
   }
}