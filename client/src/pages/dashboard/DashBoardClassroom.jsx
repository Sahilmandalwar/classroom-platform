

import { useEffect, useState } from "react";
import { GraduationCap, FolderOpen } from "lucide-react";
import { getMyClassrooms } from "../../services/classroomServices.js";
import ClassroomCards from "../../components/classroom/ClassroomCards.jsx";

const DashBoardClassroom = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [classrooms, setClassrooms] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const data = await getMyClassrooms();
        setClassrooms(data.classrooms || []);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  const handleCopyCode = (e, code, id) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    // ✨ UPGRADE 1: Deep slate base with relative positioning for ambient glows
    <div className="w-full min-h-full p-6 md:p-10 bg-slate-950 font-sans relative overflow-hidden text-slate-100">
      {/* ✨ UPGRADE 2: Subtle Ambient Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-600/5 blur-[100px] pointer-events-none"></div>

      {/* Main Content Wrapper (keeps content above the glows) */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ✨ UPGRADE 3: Header - Fixed harsh border color */}
        <div className="mb-10 border-b pb-6 border-slate-800/80 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
              <GraduationCap className="w-7 h-7 text-indigo-400" />
            </div>
            Active Classrooms
          </h2>
        </div>

        {/* Main Content Area */}
        <section
          className="animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          {isLoading ? (
            /* Skeleton Loading State */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 h-48 animate-pulse flex flex-col justify-between"
                >
                  <div>
                    <div className="h-6 bg-slate-800 rounded-md w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-800/70 rounded-md w-full mb-2"></div>
                    <div className="h-4 bg-slate-800/70 rounded-md w-5/6"></div>
                  </div>
                  <div className="pt-4 mt-auto border-t border-slate-800/80 flex justify-between">
                    <div className="h-5 bg-slate-800 rounded-md w-20"></div>
                    <div className="h-5 bg-slate-800 rounded-md w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : classrooms.length === 0 ? (
            /* ✨ UPGRADE 4: Empty State - Fixed min-h typo and improved styling */
            <div className="bg-slate-900/30 backdrop-blur-sm border border-dashed border-slate-700/50 rounded-3xl p-12 md:p-16 text-center flex flex-col items-center justify-center min-h-[350px] shadow-lg">
              <div className="w-20 h-20 bg-slate-800/80 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 shadow-inner group-hover:scale-105 transition-transform">
                <FolderOpen className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-slate-100 mb-3">
                No classrooms found
              </h3>
              <p className="text-slate-400 max-w-md mx-auto leading-relaxed text-sm md:text-base">
                You haven't created or joined any classrooms yet. Use the
                sidebar menu to create a new classroom and get started.
              </p>
            </div>
          ) : (
            /* Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classrooms.map((classroom) => (
                <ClassroomCards
                  classroom={classroom}
                  key={classroom._id}
                  handleCopyCode={handleCopyCode}
                  copiedId={copiedId}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashBoardClassroom;