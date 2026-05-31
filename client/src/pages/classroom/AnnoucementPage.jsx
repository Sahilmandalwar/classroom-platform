

import { Megaphone } from "lucide-react";
import AnnouncementList from "../../components/announcement/AnnouncementList.jsx";
import { useAuth } from "../../contexts/authContext";
import { useState } from "react";
import socket from '../../socket.js';
import {
  createAnnoucement,
  deleteAnnouncement,

} from "../../services/announcementServices";
import { useEffect } from "react";

const AnnoucementPage = ({
  activeTab,
  classroom,
  setAnnouncements,
  announcements,
  classId,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ADDED: isLoading state for the feed section.
  // It defaults to false assuming data is passed in as props initially.
  const [isLoading, setIsLoading] = useState(false);

  const [formError, setFormError] = useState("");
  const { currentUserId } = useAuth();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(()=>{
    socket.on("newAnnouncement", (data) => {
      console.log("Live Announcement received: ", data);
      setAnnouncements((prev) => {
        const alreadyExist = prev.some((item) => 
          item._id === data.announcement._id
        );

        if (alreadyExist) {
          return prev;
        }

        return [data.announcement, ...prev];
      });
    });

    socket.on("deletedAnnouncement", (data)=>{
      console.log("Live Announcement deleted: ", data);
      setAnnouncements((prev)=>{
        const alreadyDeleted = !prev.some((item) => 
          item._id === data.deletedAnnouncement._id
        )

        if(alreadyDeleted) {
          return prev;
        }

        return prev.filter((item)=>
          item._id !== data.deletedAnnouncement._id
        )
      })
    })

    return ()=>{
      socket.off("newAnnouncement");
      socket.off("deletedAnnouncement");
    }
  },[setAnnouncements])

  const handleDeleteAnnouncement = async (announcementId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this announcement?",
    );
    if (!isConfirmed) return;

    try {
      await deleteAnnouncement(announcementId);
      
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert("Failed to delete announcement. Please try again.");
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!title.trim() || !message.trim()) {
      setFormError("Both title and message are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      // Optional: Set feed to loading while waiting for fresh data
      setIsLoading(true);

      await createAnnoucement({ title, message, classroomId: classId });
      setTitle("");
      setMessage("");

      
    } catch (error) {
      console.error(error);
      setFormError("Failed to post announcement. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false); // Turn off the feed spinner
    }
  };

  return (
    <div>
      {activeTab === "announcements" && (
        <div className="space-y-8 animate-fade-in-up">
          {/* Form (Teacher Only) */}
          {currentUserId === classroom.teacher?._id && (
            <section className="p-6 border md:p-8 bg-slate-900/40 border-slate-800 rounded-2xl">
              <h2 className="flex items-center gap-2 mb-6 text-xl font-semibold text-white">
                <Megaphone className="w-5 h-5 text-amber-400" /> Post New
                Announcement
              </h2>
              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                {formError && (
                  <div className="px-4 py-3 text-sm text-red-400 border rounded-lg bg-red-950/30 border-red-900/50">
                    {formError}
                  </div>
                )}
                <div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full px-4 py-3 text-white transition-colors border rounded-lg bg-slate-950 border-slate-800 focus:outline-none focus:border-amber-400"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your announcement details here..."
                    rows="4"
                    className="w-full px-4 py-3 text-white transition-colors border rounded-lg resize-none bg-slate-950 border-slate-800 focus:outline-none focus:border-amber-400"
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !title.trim() || !message.trim()}
                    className="px-6 py-2.5 font-semibold text-slate-900 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-50"
                  >
                    {isSubmitting ? "Posting..." : "Post Announcement"}
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Feed */}
          <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800/80 pb-5">
              <div className="p-2 bg-amber-400 rounded-lg">
                <Megaphone className="w-5 h-5 text-slate-800" />
              </div>
              <h2 className="text-xl font-semibold text-slate-100">
                Announcement Board
              </h2>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-4">
                <div className="w-8 h-8 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin"></div>
                <span className="text-slate-500 text-sm font-medium animate-pulse">
                  Loading announcements...
                </span>
              </div>
            ) : (
              <AnnouncementList
                announcements={announcements}
                handleDeleteAnnouncement={handleDeleteAnnouncement}
                classroom={classroom}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnoucementPage;