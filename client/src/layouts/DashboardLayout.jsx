
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/sidebars/DashboardSidebar";
import { Menu, X } from "lucide-react"; // Make sure to import these!

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Automatically close the sidebar on mobile when the user clicks a link and the route changes!
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname],);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* --- MOBILE OVERLAY --- */}
      {/* This creates a darkened backdrop when the sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800/80 shadow-2xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile close button (X) inside the sidebar */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <Sidebar />
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* MOBILE TOP BAR (Only visible on small screens) */}
        <div className="flex items-center h-16 px-4 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 md:hidden shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <Menu className="w-6 h-6" />
          </button>
          {/* You can add your app logo or name here for mobile */}
          
        </div>

        {/* PAGE CONTENT (The Dashboard, Classroom, etc.) */}
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
