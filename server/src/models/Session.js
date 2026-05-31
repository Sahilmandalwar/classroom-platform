import mongoose from "mongoose";


const sessionSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    meetingLink: {
        type: String,
        required: true,
        unique: true,
    },
    scheduledAt : {
        type: Date,
        required: true,
    }, 
    classroom : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom",
        required: true,
    },
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {
    timestamps : true,
});

export default mongoose.model("Session", sessionSchema);