

import { Video } from "lucide-react";
import SessionCard from "./SessionCard";

const SessionList = ({ sessions, isTeacher, setSessions , classroom}) => {
  // Beautiful Empty State
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-12 border border-slate-800/50 rounded-2xl bg-slate-900/20 text-slate-500">
        <div className="p-4 mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
          <Video className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200 mb-2">
          No Sessions Yet
        </h3>
        <p className="text-sm text-center text-slate-400 max-w-sm">
          Upcoming live streams, meetings, and recordings will appear here.
        </p>
      </div>
    );
  }

  // Populated Grid State
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {sessions.map((session) => (
        <SessionCard
          key={session._id}
          session={session}
          classroom={classroom}
          isTeacher={isTeacher}
          setSessions={setSessions}
        />
      ))}
    </div>
  );
};

export default SessionList;
