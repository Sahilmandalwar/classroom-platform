import API from "./api";

export const fetchMessage = async(classId)=>{
    const response = await API.get(`/message/${classId}`);
    return response.data;
}

export const sendMessage = async(classId, message)=>{
    const response = await API.post(`/message/${classId}`, {message});
    return response.data;
}