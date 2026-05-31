import API from "./api";


// MARK ATTENDANCE
export const markAttendance = async (attendanceData) => {
  const response = await API.post(
    `/attendance/mark`,
    attendanceData,
  );

  return response.data;
};


// GET SESSION ATTENDANCE
export const getSessionAttendance = async (sessionId) => {
  const response = await API.get(
    `attendance/fetch/${sessionId}`,
  );

  return response.data;
};


// GET MY ATTENDANCE
export const getMyAttendance = async (classId) => {
  const response = await API.get(
    `/attendance/my-attendence/${classId}`,
  );

  return response.data;
};