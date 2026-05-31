

import { useEffect, useState } from "react";
import {
  GraduationCap,

  FolderOpen,

} from "lucide-react";

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
    // Added a container with valid padding and a subtle background
    // to distinguish the content area from the rest of the layout
    <div className="w-full h-full p-6 md:p-10 bg-slate-900/50 border shadow-inner font-sans ">
      {/* Dashboard Header - Removed the button, improved spacing */}
      <div className="mb-10 border-b pb-6 border-indigo-300">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
            <GraduationCap className="w-6 h-6 text-indigo-400" />
          </div>
          Active Classrooms
        </h2>
      </div>

      {/* Main Content Area */}
      <section>
        {isLoading ? (
          /* Skeleton Loading State */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 h-48 animate-pulse flex flex-col justify-between"
              >
                <div>
                  <div className="h-6 bg-slate-700/50 rounded-md w-3/4 mb-4"></div>
                  <div className="h-4 bg-slate-700/30 rounded-md w-full mb-2"></div>
                  <div className="h-4 bg-slate-700/30 rounded-md w-5/6"></div>
                </div>
                <div className="pt-4 mt-auto border-t border-slate-700/50 flex justify-between">
                  <div className="h-5 bg-slate-700/50 rounded-md w-20"></div>
                  <div className="h-5 bg-slate-700/50 rounded-md w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : classrooms.length === 0 ? (
          /* Empty State - Adjusted wording since there's no button here */
          <div className="bg-slate-800/20 border-2 border-dashed border-slate-700/50 rounded-3xl p-16 text-center flex flex-col items-center justify-center min-h-87.5">
            <div className="w-20 h-20 bg-slate-800/80 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 shadow-lg">
              <FolderOpen className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              No classrooms found
            </h3>
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
              You haven't created or joined any classrooms yet. Use the sidebar
              menu to create a new classroom and get started.
            </p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
            {classrooms.map((classroom) => (
             < ClassroomCards classroom={classroom} key={classroom._id} handleCopyCode={handleCopyCode} copiedId={copiedId}/>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashBoardClassroom;