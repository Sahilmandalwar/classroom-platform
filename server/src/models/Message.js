import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required :true,
    },
    classroom : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Classroom",
        required: true,
    },
    message : {
        type : String,
        required: true,
    }

}, 
{
    timestamps: true
})

export default mongoose.model("Message", messageSchema);