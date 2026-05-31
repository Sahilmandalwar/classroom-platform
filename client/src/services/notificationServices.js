import API from "./api";

export const readNotification = async(notificationId)=>{
    const response = await API.patch(`/notification/${notificationId}/read`);
    return response.data;
}

export const readAllNotification = async()=>{
    const response = await API.patch(`/notification/read-all`);
    return response.data;
}