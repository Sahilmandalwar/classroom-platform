

import { useState, useEffect } from "react";
import { BookOpen, UploadCloud, FileIcon } from "lucide-react";
import { useAuth } from "../../contexts/authContext";
import { uploadFile, fetchFile } from "../../services/notesServices";
import NotesCard from "../../components/notes/NotesCard";
import socket from "../../socket";

const NotesPage = ({ activeTab, classroom }) => {
  const { currentUserId } = useAuth();

  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Page Loading & Data States
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    socket.on("uploadedNotes",(data)=>{
      setNotes((prev)=>{
        const alreadyExist = prev.some((item)=>
        item._id === data.notes._id);

        if(alreadyExist) {
          return prev;
        }

        return [data.notes, ...prev];
      })
    });

    socket.on("deletedNotes", (data) => {
      setNotes((prev) => {
        const alreadyDeleted = !prev.some(
          (item) => item._id === data.deletedNotes._id,
        );

        if (alreadyDeleted) {
          return prev;
        }

        return prev.filter((item) => item._id !== data.deletedNotes._id);
      });
    });
    if (activeTab === "notes" && classroom?._id) {
      const getInitialNotes = async () => {
        setIsLoading(true);
        try {
          const data = await fetchFile(classroom._id);
          setNotes(data.notes || []);
        } catch (error) {
          console.error("Error fetching notes:", error);
          setFormError("Could not load study materials.");
        } finally {
          setIsLoading(false);
        }
      };

      getInitialNotes();
    }

    return ()=>{
      socket.off("uploadedNotes");
      socket.off("deletedNotes");
    }
  }, [activeTab, classroom?._id, setNotes]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!title.trim() || !file) {
      setFormError("Title and a file attachment are required.");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Create FormData payload
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file);

      const classroomId = classroom._id;

      // 2. Call your actual API
      await uploadFile(classroomId, formData);

      // 3. Reset form states
      setTitle("");
      setDescription("");
      setFile(null);

      // 4. Fetch the updated notes list to refresh the UI instantly
      
    } catch (error) {
      console.error("Upload error:", error);
      setFormError("Failed to upload note. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (activeTab !== "notes") return null;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* --- TEACHER UPLOAD FORM --- */}
      {currentUserId === classroom?.teacher?._id && (
        <section className="p-6 border md:p-8 bg-slate-900/40 border-slate-800 rounded-2xl">
          <h2 className="flex items-center gap-2 mb-6 text-xl font-semibold text-white">
            <UploadCloud className="w-5 h-5 text-blue-400" /> Upload Study
            Material
          </h2>

          <form onSubmit={handleUploadSubmit} className="space-y-5">
            {formError && (
              <div className="px-4 py-3 text-sm text-red-400 border rounded-lg bg-red-950/30 border-red-900/50">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-4">
                {/* Title Input */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-400">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Week 1 Lecture Slides"
                    className="w-full px-4 py-3 text-white transition-colors border rounded-lg bg-slate-950 border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-400">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief details about this document..."
                    rows="3"
                    className="w-full px-4 py-3 text-white transition-colors border rounded-lg resize-none bg-slate-950 border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600"
                    disabled={isSubmitting}
                  ></textarea>
                </div>
              </div>

              {/* Custom File Dropzone Area */}
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-400">
                  Attachment *
                </label>
                <div className="relative flex flex-col items-center justify-center w-full h-full min-h-35 px-4 transition-colors border-2 border-dashed rounded-xl bg-slate-950/50 border-slate-700 hover:bg-slate-900 hover:border-blue-500/50 group">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isSubmitting}
                  />

                  {file ? (
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 mb-2 rounded-full bg-blue-500/20 text-blue-400">
                        <FileIcon className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-medium text-slate-200 line-clamp-1 px-4">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p
                        className="text-xs text-blue-400 mt-2 hover:underline relative z-10 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          setFile(null);
                        }}
                      >
                        Remove file
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 mb-3 rounded-full bg-slate-800 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold text-blue-400">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        PDF, DOCX, PPTX, or ZIP (MAX. 25MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800 mt-6">
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !file}
                className="inline-flex items-center justify-center px-6 py-2.5 font-semibold text-white transition-all rounded-lg bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(37,99,235,0.3)]"
              >
                {isSubmitting ? "Uploading..." : "Upload Material"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* --- NOTES FEED/GRID --- */}
      <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-800/80 pb-5">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-100">
            Study Materials
          </h2>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-4">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="text-slate-500 text-sm font-medium animate-pulse">
              Loading study materials...
            </span>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800/50 rounded-2xl bg-slate-900/20 text-slate-500">
            <div className="p-4 mb-4 rounded-full bg-slate-800/50">
              <BookOpen className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-400 mb-1">
              No Materials Yet
            </h3>
            <p className="text-sm text-center">
              PDFs, assignments, and class notes will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <NotesCard note={note} key={note._id} classroom={classroom} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;