import Notification from "../models/Notification.js";
import Classroom from "../models/Classroom.js";

export const getNotification= async(req, res)=>{
    try{

        const notifications = await Notification.find({
            receiver : req.user.id
        }).sort({createdAt : -1})
          .populate("sender", "name")
          .populate("classroom", "title")

        res.status(200).json({
            message : "notification fetched successfully",
            notifications,
        })

    }catch (error) {
    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

export const readNotification = async(req, res)=>{
  try{
    const {notificationId} = req.params;
    const notification = await Notification.findById(notificationId);

    if(!notification) {
      return res.status(404).json({
        message : "notification not found",
      })
    }

    if(notification.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        message : "Unauthorised access",
      })
    }

    notification.isRead = true;
    await notification.save();
    res.status(200).json({
      message : "notification read successfully",
      notification,
    })

  }catch(error) {
    res.status(500).json({
     message: "Notification not read",
     error: error.message
    })
  }
};

export const markAllNotification = async(req,res)=>{
  try {
    const currentUserId = req.user.id;

    const updatedNotification = await Notification.updateMany({
      receiver : currentUserId,
      isRead : false
    },{
      $set : {
        isRead : true
      }
    })

    res.status(200).json({
      message : "All Notification read",
      updatedNotification
    })
  
   
  }catch(error) {
    res.status(500).json({
     message: "Notification not read",
     error: error.message
    })
  }
}