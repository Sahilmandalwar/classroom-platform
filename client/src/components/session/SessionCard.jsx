

import { Calendar, Clock, Video, ExternalLink, Trash2 } from "lucide-react";
import { deleteSession } from "../../services/sessionServices";

// ADDED: isTeacher and onDelete props
const SessionCard = ({ session, isTeacher }) => {
  // Use the scheduled time if it exists, otherwise fallback to creation date
  // FIXED: Changed scheduleAt to scheduledAt to match your backend model
  const dateObj = new Date(session.scheduledAt || session.createdAt);

  // Format the date and time beautifully
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const onDelete = async(sessionId) => {
    try{
      const data = await deleteSession(sessionId);
     
    }catch(error){
      console.log(error?.message);
    }
    
  }

  return (
    <div className="group relative flex flex-col p-5 transition-all duration-300 border bg-slate-800/40 border-slate-700/60 rounded-2xl hover:bg-slate-800/70 hover:border-emerald-500/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-900/20">
      {/* 1. Header: Icon, Title & Delete Button */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div className="mt-1">
            <h3 className="text-lg font-semibold text-slate-100 line-clamp-1 pr-2">
              {session.title}
            </h3>
          </div>
        </div>

        {/* TEACHER ONLY: Delete Button */}
        {isTeacher && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent clicking the card if you add a wrapper link later
              onDelete(session._id);
            }}
            className="p-2 text-slate-500 transition-colors rounded-lg hover:text-red-400 hover:bg-red-500/10 shrink-0"
            title="Delete Session"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Description */}
      <p className="flex-grow mb-5 text-sm leading-relaxed text-slate-400 line-clamp-2">
        {session.description}
      </p>

      {/* 3. Footer: Date, Time, and Meeting Link */}
      <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-700/50">
        <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-900/50 px-2.5 py-1 rounded-md border border-slate-700/50">
            <Calendar className="w-3.5 h-3.5 text-emerald-500/70" />
            {formattedDate}me
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/50 px-2.5 py-1 rounded-md border border-slate-700/50">
            <Clock className="w-3.5 h-3.5 text-emerald-500/70" />
            {formattedTime}
          </div>
        </div>

        {/* Join Meeting Button */}
        {session.meetingLink && (
          <a
            href={session.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition-colors rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 hover:text-emerald-300"
            onClick={(e) => e.stopPropagation()}
          >
            Join
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

export default SessionCard;