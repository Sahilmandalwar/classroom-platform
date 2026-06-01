

import { useEffect, useState } from "react";
import {
  createClassroom,
  joinClassroom,
  getMyClassrooms,
} from "../../services/classroomServices.js";
import { BookOpen,  GraduationCap, Plus, LogIn } from "lucide-react";
import socket from "../../socket.js";

// ✅ UNCOMMENTED useAuth to get the real user ID and role
import { useAuth } from "../../contexts/authContext.jsx";

const Dashboard = () => {
  const { currentUserId } = useAuth();

  // Safe fallbacks depending on how your user object is structured

  const [classrooms, setClassrooms] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    

    socket.on("newClassroomAdded", ({ classroom }) => {
      // Prevent duplicates in case the local state already added it
      setClassrooms((prev) => {
        if (prev.some((c) => c._id === classroom._id)) return prev;
        return [...prev, classroom];
      });
    });

    const fetchClassrooms = async () => {
      try {
        const data = await getMyClassrooms();
        setClassrooms(data.classrooms || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchClassrooms();

    return () => {
      socket.off("newClassroomAdded");
    };
  }, [currentUserId]);

  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await createClassroom({
        title,
        description,
      });

      setTitle("");
      setDescription("");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinClassroom = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    setIsJoining(true);
    try {
      const response = await joinClassroom({ classCode: joinCode });

      // ✅ INSTANT UI UPDATE: Add the joined classroom to state
      if (response && response.classroom) {
        setClassrooms((prev) => [...prev, response.classroom]);
      }

      setJoinCode("");
    } catch (error) {
      console.log(error);
    } finally {
      setIsJoining(false);
    }
  };

  // ✅ DYNAMIC STATS CALCULATION
  // We figure out which classes you own vs joined by comparing the teacher ID to your ID
  const ownedCount = classrooms.filter((c) => {
    const teacherId = c.teacher?._id || c.teacher;
    return teacherId.toString() === currentUserId;
  }).length;

  const joinedCount = classrooms.length - ownedCount;


  const stats = {
    joinedClasses: joinedCount,
    ownedClasses: ownedCount,
  };

  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-8 font-sans antialiased text-slate-100 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-1/2 h-96 bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-1/3 h-64 bg-emerald-600/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* --- HEADER --- */}
        <header className="border-b border-slate-800/60 pb-6 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400">
            Welcome To Classroom
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            Check what's happening in your classrooms today.
          </p>
        </header>

        {/* --- VISUAL OVERVIEW STATS --- */}
        <section
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          {
            <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(99,102,241,0.1)]">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">
                  Total Classrooms Owned
                </p>
                <h3 className="text-3xl font-bold text-slate-100">
                  {stats.ownedClasses}
                </h3>
              </div>
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 absolute">
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-slate-800"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray="150"
                    strokeDashoffset="40"
                    className="text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                  />
                </svg>
                <GraduationCap className="w-5 h-5 text-indigo-400 relative z-10" />
              </div>
            </div>
          }
          {/* Stat 1: Joined Classes */}



          <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)]">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Total Classes Joined
              </p>
              <h3 className="text-3xl font-bold text-slate-100">
                {stats.joinedClasses}
              </h3>
            </div>
            <div className="relative w-14 h-14 flex items-center justify-center">
              {/* Fake CSS Circular Chart */}
              <svg className="w-full h-full transform -rotate-90 absolute">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-slate-800"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray="150"
                  strokeDashoffset="60"
                  className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                />
              </svg>
              <BookOpen className="w-5 h-5 text-blue-400 relative z-10" />
            </div>
          </div>
          {/* Stat 2: Owned Classes (Conditional for Teachers) */}
        </section>

        {/* --- ACTIONS GRID (Create & Join) --- */}
        <section
          className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          {/* LEFT: Create Classroom */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden group">
            {/* Soft decorative gradient corner */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500"></div>

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <Plus className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Create a Classroom
              </h2>
            </div>

            <form
              onSubmit={handleCreateClassroom}
              className="flex flex-col gap-4 relative z-10"
            >
              <input
                type="text"
                required
                placeholder="Classroom title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950/50 text-white border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-slate-500"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950/50 text-white border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="mt-2 w-full md:w-auto self-start inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white transition-all duration-200 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95"
              >
                {isSubmitting ? "Creating..." : "Create Classroom"}
              </button>
            </form>
          </div>

          {/* RIGHT: Join Classroom */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-lg relative group">
            {/* Soft decorative gradient corner */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <LogIn className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Join a Classroom
              </h2>
            </div>

            <form
              onSubmit={handleJoinClassroom}
              className="flex flex-col gap-4 relative z-10 h-full"
            >
              <input
                type="text"
                required
                placeholder="Enter class code (e.g. QNT-1234)"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="w-full bg-slate-950/50 text-emerald-100 font-mono tracking-widest border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder-slate-500 uppercase"
              />
              <p className="text-xs text-slate-500 -mt-1 ml-1 mb-2">
                Ask your teacher for the class code, then enter it here.
              </p>

              <button
                type="submit"
                disabled={isJoining || !joinCode.trim()}
                className=" w-full md:w-auto self-start inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-slate-100 transition-all duration-200 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-95"
              >
                {isJoining ? "Joining..." : "Join Classroom"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
