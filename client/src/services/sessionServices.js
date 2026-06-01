import API from "./api";

export const createSession = async(classroomId, formData) => {
    const response = await API.post(`/session/create/${classroomId}`, formData);
    return response.data;
}

export const fetchSessions = async(classroomId) => {
    const response = await API.get(`/session/${classroomId}`);
    return response.data;
}

export const deleteSession = async(sessionId) => {
    const response = await API.delete(`/session/${sessionId}`);
    return response.data;
}
