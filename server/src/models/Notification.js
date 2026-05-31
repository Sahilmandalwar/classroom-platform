import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    receiver : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },

    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }, 

    type: {
      type: String,
      enum: ["announcement", "notes", "session", "attendance"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
    
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
}, {timestamps: true});

export default mongoose.model('Notification',notificationSchema);