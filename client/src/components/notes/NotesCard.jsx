import { FileText, LucideFileDown, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/authContext";
import { deleteNotes } from "../../services/notesServices";

const NotesCard = ({note, classroom}) => {

    const {currentUserId} = useAuth();

    const handleDeleteNotes = async() => {
      try{
        const data = await deleteNotes(note._id);
      }catch(error) {
        console.log(error?.message);
      }

    }

  return (
    <div>
      <div className="flex flex-col p-5 border bg-slate-900/60 border-slate-800 rounded-2xl hover:border-slate-700 hover:bg-slate-800/80 transition-colors group">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="grow overflow-hidden">
            <h3
              className="font-semibold text-slate-100 truncate pr-2"
              title={note.title}
            >
              {note.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1 truncate">
              {note.createdBy.name || "uploaded by"}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-400 mb-6 line-clamp-2 grow">
          {note.description || "No description provided."}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-auto">
          <span className="text-xs text-slate-500 font-medium">
            {new Date(note.createdAt || Date.now()).toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </span>
          <div className="flex items-center gap-2">
            {/* Delete Button (Teacher Only) */}
            {currentUserId === classroom?.teacher?._id && (
              <button
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteNotes();
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {/* Download Button 
                      Note: You might need to prepend your backend URL to note.fileUrl
                      if it only returns a relative path like '/uploads/file.pdf'
                    */}
            <a
              href={note.fileUrl} // ✅ REMOVED API_URL
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-700 hover:border-slate-600"
            >
              <LucideFileDown className="w-3.5 h-3.5" /> Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotesCard
