

import { LayoutDashboard, PlusCircle } from "lucide-react";

import SessionList from "../../components/session/SessionList.jsx";
import SessionForm from "../../components/session/SessionForm.jsx";

const SessionPage = ({
  activeTab,
  classroom,
  sessions,
  sessionLoading,
  isTeacher
}) => {
 

  // Determine if user is the teacher

 

  // Early return keeps the JSX tree clean
  if (activeTab !== "sessions") return null;

  return (
    <div className="animate-fade-in-up space-y-8 w-full max-w-7xl mx-auto pb-12">
      {/* 1. TOP SECTION: Create Form (Teacher Only) */}
      {isTeacher && (
        <div className="bg-slate-900/40 backdrop-blur-sm border border-emerald-900/30 rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800/80 pb-5">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-100">
              Schedule New Session
            </h2>
          </div>

          {/* Centering the form for a cleaner look */}
          <div className="flex justify-center w-full">
            <div className="w-full max-w-7xl">
              <SessionForm
                classroomId={classroom?._id}
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. BOTTOM SECTION: Sessions List (Visible to Everyone) */}
      <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-800/80 pb-5">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <LayoutDashboard className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-100">
            Session Timeline
          </h2>
        </div>

        {sessionLoading ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-4">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin"></div>
            <span className="text-slate-500 text-sm font-medium animate-pulse">
              Loading sessions...
            </span>
          </div>
        ) : (
          <SessionList
            classroom={classroom}
            sessions={sessions}
            isTeacher={isTeacher}
          />
        )}
      </div>
    </div>
  );
};

export default SessionPage;