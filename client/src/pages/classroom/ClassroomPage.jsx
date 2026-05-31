import { useEffect, useState } from "react";
import {
  Megaphone,
  Video,
  BookOpen,
  ClipboardCheck,
  MessageCircleReply
} from "lucide-react";

import ClassroomHeader from "./HeaderClassroom.jsx";
import AnnoucementPage from "./AnnoucementPage.jsx";
import { fetchClass } from "../../services/classroomServices.js";
import { fetchAllAnnouncement } from "../../services/announcementServices.js";
import SessionPage from "./SessionPage.jsx";
import NotesPage from "./NotesPage.jsx";
import { useParams, useSearchParams } from "react-router-dom";
import AttendancePage from "./AttendancePage.jsx";
import { fetchSessions } from "../../services/sessionServices.js";
import { useAuth } from "../../contexts/authContext.jsx";
import socket from "../../socket.js";
import ChatPage from "./Chatpage.jsx";

const ClassroomPage = () => {
  const { classId } = useParams();
  const [sessions, setSessions] = useState([]);
  
  // Data States
  const [classroom, setClassroom] = useState(null);

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  
  // ✅ ADDED: State to hold the online user count globally for the room
  const [onlineUserCount, setOnlineUserCount] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  // Read the "tab" from the URL. If it doesn't exist, default to "announcements"
  const activeTab = searchParams.get("tab") || "announcements";
  const [sessionLoading, setSessionLoading] = useState(true);
  const { currentUserId } = useAuth();
  
  // --- 1. INITIAL DATA FETCH ---
  useEffect(() => {
    if(classId){
      socket.emit("joinClassRoom", {classId, userId : currentUserId});
    }

    // ✅ ADDED: Listen for the online user count as soon as we join the room!
    socket.on("ClassroomOnlineUsers", (count) => {
      setOnlineUserCount(count);
    });

    socket.on("newSession", (data)=>{
      setSessions((prev)=>{
        const alreadyExist = prev.some((item)=>
        item._id === data.session._id);

        if (alreadyExist) {
          return prev;
        }
        return [data.session, ...prev];
      })
    });

    socket.on("deletedSession", (data)=>{
      setSessions((prev)=>{
        const alreadyDeleted = !prev.some((item)=>
          item._id === data.session._id,
        )

        if(alreadyDeleted) {
          return prev;
        }

        return prev.filter((item) =>
          item._id !== data.session._id,
        );
      })
    })

    const getPageData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchClass(classId);
        setClassroom(data.classroom || null);
        
      } catch (error) {
        console.error("Error fetching classroom:", error);
        setError("Failed to load classroom details.");
      } finally {
        setIsLoading(false);
      }
    };

    const getSessions = async () => {
      try {
        setSessionLoading(true);

        const data = await fetchSessions(classId);

        setSessions(data.sessions || []);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setSessionLoading(false);
      }
    };

    const getAnnouncements = async () => {
      try {
        const data = await fetchAllAnnouncement(classId);
        setAnnouncements(data.announcements || []);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    if (classId) {
      getPageData();
      getAnnouncements();
      getSessions();
    }

    return ()=>{
      socket.emit("leaveClassroomRoom", {classId, userId : currentUserId});
      socket.off("ClassroomOnlineUsers"); // ✅ ADDED: Cleanup the listener
      socket.off("newSession");
      socket.off("deletedSession");
    }
  }, [classId, currentUserId, setSessions]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error || !classroom)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="px-6 py-4 text-red-400 border rounded-lg bg-red-950/30 border-red-900/50">
          {error || "Classroom not found."}
        </div>
      </div>
    );

  // --- 5. TABS CONFIGURATION ---
  const tabs = [
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "sessions", label: "Live Sessions", icon: Video },
    { id: "notes", label: "Study Notes", icon: BookOpen },
    { id: "attendance", label: "Attendance", icon: ClipboardCheck },
    { id: "chats", label : "Chat Section", icon: MessageCircleReply}
  ];

   
  const isTeacher = classroom?.teacher?._id === currentUserId;

  // --- 6. MAIN UI ---
  return (
    <div className="min-h-screen p-4 md:p-10 bg-slate-950 text-slate-200 font-sans">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* HEADER CARD */}
        <ClassroomHeader classroom={classroom} setIsLoading={setIsLoading} />

        {/* NAVIGATION TABS */}
        <nav className="flex items-center p-1.5 space-x-2 overflow-x-auto bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSearchParams({ tab: tab.id })}
                className={`flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-amber-400 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-slate-900" : "text-slate-500"}`}
                />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* TAB CONTENT AREA */}
        <div className="min-h-100">
          {/* --- ANNOUNCEMENTS TAB CONTENT --- */}
          <AnnoucementPage
            activeTab={activeTab}
            classroom={classroom}
            classId={classId}
            setAnnouncements={setAnnouncements}
            announcements={announcements}
          />

          {/* --- SESSIONS TAB CONTENT (Placeholder) --- */}
          <SessionPage
            activeTab={activeTab}
            classroom={classroom}
            setSessions={setSessions}
            sessions={sessions}
            sessionLoading={sessionLoading}
            isTeacher={isTeacher}
          />

          {/* --- NOTES TAB CONTENT (Placeholder) --- */}
          <NotesPage activeTab={activeTab} classroom={classroom} />

          {/* --- ATTENDANCE TAB CONTENT (Placeholder) --- */}
          <AttendancePage
            activeTab={activeTab}
            classroom={classroom}
            isTeacher={isTeacher}
            sessions={sessions}
          />

          {/* --- CHAT TAB CONTENT ---  */}
          {/* ✅ ADDED: Passing the onlineUserCount down as a prop */}
          <ChatPage 
            activeTab={activeTab} 
            classroom={classroom} 
            onlineUserCount={onlineUserCount} 
          />
        </div>
      </div>
    </div>
  );
};

export default ClassroomPage;