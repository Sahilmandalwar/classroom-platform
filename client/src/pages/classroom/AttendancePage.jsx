// import { useState, useEffect } from "react";
// import {
//   markAttendance,
//   getMyAttendance,
// } from "../../services/attendenceService";

// const AttendancePage = ({ activeTab, classroom, sessions, isTeacher }) => {
//   const [attendanceRecords, setAttendanceRecords] = useState({});
//   const [selectedSession, setSelectedSession] = useState("");
//   const [myAttendance, setMyAttendance] = useState([]);
//   const [loadingAttendance, setLoadingAttendance] = useState(false);

//   useEffect(() => {
//     const fetchMyAttendance = async () => {
//       if (isTeacher) return;

//       try {
//         setLoadingAttendance(true);
//         const data = await getMyAttendance(classroom._id);
//         setMyAttendance(data.attendance || []);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoadingAttendance(false);
//       }
//     };

//     if (activeTab === "attendance") {
//       fetchMyAttendance();
//     }
//   }, [activeTab, classroom._id, isTeacher]);

//   if (activeTab !== "attendance") return null;

//   const handleStatusChange = (studentId, status) => {
//     setAttendanceRecords((prev) => ({
//       ...prev,
//       [studentId]: status,
//     }));
//   };

//   const handleSubmitAttendance = async () => {
//     try {
//       if (!selectedSession) {
//         alert("Please select a session");
//         return;
//       }

//       const records = classroom.students.map((student) => ({
//         studentId: student._id,
//         status: attendanceRecords[student._id] || "absent",
//       }));

//       const payload = {
//         sessionId: selectedSession,
//         records,
//       };

//       const data = await markAttendance(payload);

//       alert(data.message);
//       setAttendanceRecords({});
//       setSelectedSession("");
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || "Failed to mark attendance");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* TEACHER VIEW */}
//       {isTeacher ? (
//         <div className="p-6 border bg-slate-900/50 border-slate-800 rounded-2xl shadow-sm">
//           <h2 className="text-2xl font-bold text-amber-400">Mark Attendance</h2>

//           <div className="mt-6">
//             <label className="block mb-2 text-sm font-medium text-slate-300">
//               Select Session
//             </label>

//             <select
//               value={selectedSession}
//               onChange={(e) => setSelectedSession(e.target.value)}
//               className="w-full px-4 py-3 transition-all border outline-none rounded-xl bg-slate-800 border-slate-700 text-slate-200 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-400/20"
//             >
//               <option value="">Choose a session</option>
//               {sessions?.map((session) => (
//                 <option key={session._id} value={session._id}>
//                   {session.title}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <p className="mt-3 text-sm text-slate-400">
//             Select attendance status for students.
//           </p>

//           <div className="mt-6 space-y-3">
//             {selectedSession &&
//               classroom?.students?.map((student) => {
//                 const selectedStatus = attendanceRecords[student._id];

//                 return (
//                   <div
//                     key={student._id}
//                     className="flex items-center justify-between p-4 transition-colors border rounded-xl border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/60"
//                   >
//                     {/* STUDENT INFO */}
//                     <div>
//                       <h3 className="font-semibold text-slate-200">
//                         {student.name}
//                       </h3>
//                       <p className="text-sm text-slate-400">{student.email}</p>
//                     </div>

//                     {/* BUTTONS */}
//                     <div className="flex gap-2 sm:gap-3">
//                       <button
//                         onClick={() =>
//                           handleStatusChange(student._id, "present")
//                         }
//                         className={`px-4 py-2 text-sm sm:text-base rounded-lg font-medium transition-all duration-200 ${
//                           selectedStatus === "present"
//                             ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
//                             : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
//                         }`}
//                       >
//                         Present
//                       </button>

//                       <button
//                         onClick={() =>
//                           handleStatusChange(student._id, "absent")
//                         }
//                         className={`px-4 py-2 text-sm sm:text-base rounded-lg font-medium transition-all duration-200 ${
//                           selectedStatus === "absent"
//                             ? "bg-red-500 text-white shadow-md shadow-red-500/20"
//                             : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
//                         }`}
//                       >
//                         Absent
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>

//           {/* SUBMIT BUTTON */}
//           <button
//             onClick={handleSubmitAttendance}
//             disabled={!selectedSession}
//             className={`px-8 py-3.5 mt-8 font-semibold rounded-xl transition-all duration-300 ${
//               selectedSession
//                 ? "bg-amber-400 text-black hover:bg-amber-300 shadow-lg shadow-amber-400/20"
//                 : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
//             }`}
//           >
//             Submit Attendance
//           </button>
//         </div>
//       ) : (
//         /* STUDENT VIEW */
//         <div className="p-6 border bg-slate-900/50 border-slate-800 rounded-2xl shadow-sm">
//           <h2 className="text-2xl font-bold text-emerald-400">
//             Attendance History
//           </h2>

//           <p className="mt-2 text-slate-400">
//             Your classroom attendance records.
//           </p>

//           {/* BEAUTIFUL SKELETON LOADER */}
//           {loadingAttendance ? (
//             <div className="mt-8 space-y-3">
//               {[1, 2, 3, 4].map((i) => (
//                 <div
//                   key={i}
//                   className="flex items-center justify-between p-4 border border-slate-700/30 bg-slate-800/20 rounded-xl animate-pulse"
//                 >
//                   <div className="space-y-2.5">
//                     <div className="w-32 h-5 rounded-md bg-slate-700/50"></div>
//                     <div className="w-24 h-4 rounded-md bg-slate-700/30"></div>
//                   </div>
//                   <div className="w-20 h-8 rounded-lg bg-slate-700/40"></div>
//                 </div>
//               ))}
//             </div>
//           ) : myAttendance.length === 0 ? (
//             <div className="p-8 mt-8 text-center border border-dashed rounded-xl border-slate-700 bg-slate-800/20 text-slate-400">
//               No attendance records found.
//             </div>
//           ) : (
//             <div className="mt-8 space-y-3">
//               {myAttendance.map((record) => (
//                 <div
//                   key={record._id}
//                   className="flex items-center justify-between p-4 transition-colors border rounded-xl border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/60"
//                 >
//                   <div>
//                     <h3 className="font-semibold text-slate-200">
//                       {record.session?.title || "Session"}
//                     </h3>
//                     <p className="mt-1 text-sm text-slate-400">
//                       {new Date(record.createdAt).toLocaleDateString(
//                         undefined,
//                         {
//                           weekday: "short",
//                           year: "numeric",
//                           month: "short",
//                           day: "numeric",
//                         },
//                       )}
//                     </p>
//                   </div>

//                   <div
//                     className={`px-4 py-1.5 rounded-lg text-sm font-semibold tracking-wide uppercase border ${
//                       record.status === "present"
//                         ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
//                         : "bg-red-500/10 text-red-400 border-red-500/20"
//                     }`}
//                   >
//                     {record.status}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AttendancePage;
import { useState, useEffect } from "react";
import { ClipboardCheck, History, CalendarDays } from "lucide-react";
import {
  markAttendance,
  getMyAttendance,
} from "../../services/attendenceService";

const AttendancePage = ({ activeTab, classroom, sessions, isTeacher }) => {
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [selectedSession, setSelectedSession] = useState("");
  const [myAttendance, setMyAttendance] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  useEffect(() => {
    const fetchMyAttendance = async () => {
      if (isTeacher) return;

      try {
        setLoadingAttendance(true);
        const data = await getMyAttendance(classroom._id);
        setMyAttendance(data.attendance || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingAttendance(false);
      }
    };

    if (activeTab === "attendance") {
      fetchMyAttendance();
    }
  }, [activeTab, classroom._id, isTeacher]);

  if (activeTab !== "attendance") return null;

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmitAttendance = async () => {
    try {
      if (!selectedSession) {
        alert("Please select a session");
        return;
      }

      const records = classroom.students.map((student) => ({
        studentId: student._id,
        status: attendanceRecords[student._id] || "absent",
      }));

      const payload = {
        sessionId: selectedSession,
        records,
      };

      const data = await markAttendance(payload);

      alert(data.message);
      setAttendanceRecords({});
      setSelectedSession("");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to mark attendance");
    }
  };


console.log(myAttendance)
  return (
    <div className="w-full max-w-7xl mx-auto pb-12 space-y-8 animate-fade-in-up">
      {/* 1. TEACHER VIEW */}
      {isTeacher ? (
        <div className="p-6 border shadow-lg bg-slate-900/40 backdrop-blur-sm border-amber-900/30 rounded-2xl md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800/80 pb-5">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <ClipboardCheck className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-100">
              Mark Attendance
            </h2>
          </div>

          {/* Session Selection */}
          <div className="max-w-xl mt-6">
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-300">
              <CalendarDays className="w-4 h-4 text-slate-500" />
              Select Session
            </label>

            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full px-4 py-3 transition-all border outline-none rounded-xl bg-slate-800/80 border-slate-700 text-slate-200 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-400/20"
            >
              {/* Added explicit dark backgrounds to options to prevent native white dropdowns */}
              <option value="" className="bg-slate-800 text-slate-200">
                Choose a session to evaluate...
              </option>
              {sessions?.map((session) => (
                <option
                  key={session._id}
                  value={session._id}
                  className="bg-slate-800 text-slate-200"
                >
                  {session.title}
                </option>
              ))}
            </select>
          </div>

          {/* Student List */}
          {selectedSession && (
            <div className="mt-8">
              <p className="mb-4 text-sm font-medium text-slate-400">
                Student Roster
              </p>

              {/* Changed from vertical stack to a 3-column grid layout */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {classroom?.students?.map((student) => {
                  const selectedStatus = attendanceRecords[student._id];

                  return (
                    <div
                      key={student._id}
                      className="flex flex-col justify-between p-5 transition-colors border gap-4 rounded-xl border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/60"
                    >
                      {/* Student Info */}
                      <div>
                        <h3
                          className="font-semibold truncate text-slate-200"
                          title={student.name}
                        >
                          {student.name}
                        </h3>
                        <p
                          className="text-sm truncate text-slate-400"
                          title={student.email}
                        >
                          {student.email}
                        </p>
                      </div>

                      {/* Action Buttons split evenly */}
                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <button
                          onClick={() =>
                            handleStatusChange(student._id, "present")
                          }
                          className={`py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                            selectedStatus === "present"
                              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                              : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          Present
                        </button>

                        <button
                          onClick={() =>
                            handleStatusChange(student._id, "absent")
                          }
                          className={`py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                            selectedStatus === "absent"
                              ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                              : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit Button */}
              {/* <div className="pt-8 mt-6 border-t border-slate-800/80"> */}
              
                <div className="pt-8 mt-6 border-t border-slate-800/80 flex justify-start">
                <button
                  onClick={handleSubmitAttendance}
                  className="w-full px-8 py-3.5 text-sm font-medium tracking-wide text-white transition-all duration-300 shadow-lg sm:w-auto rounded-xl bg-gradient-to-r from-indigo-500/80 to-red-500/80 hover:from-orange-500 hover:to-blue-500 shadow-indigo-500/25 border border-indigo-400/30 hover:shadow-indigo-500/40 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                >
                  Submit Attendance Records
                </button>
              </div>
            </div>
          
          )}
        </div>
      ) : (
        /* 2. STUDENT VIEW */
        <div className="p-6 border shadow-lg bg-slate-900/40 backdrop-blur-sm border-emerald-900/30 rounded-2xl md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800/80 pb-5">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <History className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-100">
              My Attendance History
            </h2>
          </div>

          {/* Skeleton Loader */}
          {loadingAttendance ? (
            <div className="mt-4 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border animate-pulse border-slate-700/30 bg-slate-800/20 rounded-xl"
                >
                  <div className="space-y-2.5">
                    <div className="h-5 rounded-md w-32 bg-slate-700/50"></div>
                    <div className="w-24 h-4 rounded-md bg-slate-700/30"></div>
                  </div>
                  <div className="w-20 h-8 rounded-lg bg-slate-700/40"></div>
                </div>
              ))}
            </div>
          ) : myAttendance.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-xl border-slate-700/50 bg-slate-800/10">
              <CalendarDays className="w-12 h-12 mb-4 text-slate-600" />
              <p className="font-medium text-slate-400">
                No attendance records found yet.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Your history will appear here once marked by the teacher.
              </p>
            </div>
          ) : (
            /* Data List */
            
            <div className="mt-4 space-y-3">
              {myAttendance.map((record) => (
                <div
                  key={record._id}
                  className="flex items-center justify-between p-4 transition-colors border rounded-xl border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/60"
                >
                  <div>
                    <h3 className="font-semibold text-slate-200">
                      {record.session?.title || "Session"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {new Date(record.createdAt).toLocaleDateString(
                        undefined,
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>

                  <div
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold tracking-wide uppercase border ${
                      record.status.includes('present') 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                  >
                    {record.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendancePage;