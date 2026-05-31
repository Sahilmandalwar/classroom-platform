import { useState } from "react";
import {
  createClassroom,
  joinClassroom,
} from "../../services/classroomServices.js";


const Dashboard = () => {


  

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await createClassroom({
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
      await joinClassroom({ classCode: joinCode });
    
      setJoinCode("");
    } catch (error) {
      console.log(error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-8 font-sans antialiased text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Page Level: H1 */}
        <header className="mb-10 border-b border-gray-800 pb-4">
          <h1 className="text-4xl font-semibold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Manage and organize your classrooms.
          </p>
        </header>

        {/* Section 1: Forms Grid (Create & Join) */}
        <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT: Create Classroom */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm hover:bg-slate-800">
            <h2 className="text-lg font-medium text-white mb-4">
              Create a Classroom
            </h2>

            <form
              onSubmit={handleCreateClassroom}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                required
                placeholder="Classroom title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                // Handled properly: Added active scale (click physics) and focus rings
                className="self-start bg-gray-100 hover:bg-white disabled:bg-gray-700 disabled:text-gray-500 text-gray-900 px-6 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-800 mt-1"
              >
                {isSubmitting ? "Creating..." : "Create"}
              </button>
            </form>
          </div>

          {/* RIGHT: Join Classroom */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm  hover:bg-slate-800">
            <h2 className="text-lg font-medium text-white mb-4">
              Join a Classroom
            </h2>

            <form
              onSubmit={handleJoinClassroom}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                required
                placeholder="Enter class code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={isJoining || !joinCode.trim()}
                // Handled properly: active state and focus rings for the secondary button
                className="self-start bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white border border-gray-600 disabled:border-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 mt-1"
              >
                {isJoining ? "Joining..." : "Join"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
