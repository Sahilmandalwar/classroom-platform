import { useState } from "react";
import { createSession } from "../../services/sessionServices";

const SessionForm = ({ classroomId}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      const formData = {
        title,
        description,
        meetingLink,
        scheduledAt,
      };

      // 1. Create the session
      const data = await createSession(classroomId, formData);
      // setSessions((prev)=>[data.session, ...prev])
      // 2. Clear the form state
      setTitle("");
      setDescription("");
      setMeetingLink("");
      setScheduledAt("");

      setIsSubmitting(false);
      
    } catch (error) {
      console.error("Error creating session:", error);
      setFormError("Failed to schedule session. Please try again.");
      
    }
  };

  return (
    <form onSubmit={handleCreateSession} className="space-y-4 w-full">
      {/* Error Message Display */}
      {formError && (
        <div className="px-4 py-3 text-sm text-red-400 border rounded-lg bg-red-950/30 border-red-900/50">
          {formError}
        </div>
      )}

      {/* Title Input */}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Session Title (e.g., Day 1: Array Manipulation)"
          className="w-full px-4 py-3 text-white transition-colors border rounded-lg bg-slate-950 border-slate-800 focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
          disabled={isSubmitting}
          required
        />
      </div>

      {/* Description Input */}
      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write the session details or agenda here..."
          rows="4"
          className="w-full px-4 py-3 text-white transition-colors border rounded-lg resize-none bg-slate-950 border-slate-800 focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
          disabled={isSubmitting}
          required
        ></textarea>
      </div>

      {/* Grid for Link and Date inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Meeting Link Input */}
        <div>
          <input
            type="url"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="Meeting Link (https://meet.google.com/...)"
            className="w-full px-4 py-3 text-white transition-colors border rounded-lg bg-slate-950 border-slate-800 focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Schedule Date/Time Input */}
        <div>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full px-4 py-3 text-white transition-colors border rounded-lg bg-slate-950 border-slate-800 focus:outline-none focus:border-emerald-500 [color-scheme:dark]"
            disabled={isSubmitting}
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={
            isSubmitting ||
            !title.trim() ||
            !description.trim() ||
            !meetingLink.trim() ||
            !scheduledAt
          }
          className="px-6 py-2.5 font-semibold text-white rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Scheduling..." : "Schedule Session"}
        </button>
      </div>
    </form>
  );
};

export default SessionForm;
