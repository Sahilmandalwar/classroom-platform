import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  // Video,
  // FileText,
  // Bell,
  BookOpen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/authServices";

// Helper function to extract initials from a name (e.g., "John Doe" -> "JD")
const getInitials = (name) => {
  if (!name) return "";
  const names = name.trim().split(" ");
  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return names[0].substring(0, 2).toUpperCase();
};

const Sidebar = () => {
  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Classrooms", path: "/dashboard/classrooms", icon: Users },
    // { name: "Sessions", path: "/dashboard/sessions", icon: Video },
    // { name: "Notes", path: "/dashboard/notes", icon: FileText },
    // { name: "Announcements", path: "/dashboard/announcements", icon: Bell },
  ];

  // Store the whole user object instead of just the name.
  // This makes it easier to use role, email, etc., later.
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const data = await getCurrentUser();
        // Assuming your API returns { user: { name: '...', role: '...' } }
        if (data && data.user) {
          setUser(data.user.name);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };

    fetchCurrentUser();
  }, []); // <-- EMPTY ARRAY: Only run once on mount!

  return (
    <div className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col font-sans">
      {/* Brand Header */}
      <div className="p-6 mb-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
          <BookOpen className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400">
          Classroom
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1.5">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                isActive
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]"
                  : "text-slate-400 border border-transparent hover:bg-slate-800 hover:text-slate-200"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon
                  className={`w-5 h-5 transition-colors ${
                    isActive
                      ? "text-blue-400"
                      : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />
                {link.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User / Bottom Section */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 cursor-pointer hover:bg-slate-800 transition-colors">
          <div className="w-9 h-9 rounded-full bg-linear-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-inner">
            {/* Display dynamic initials, or a fallback '?' while loading */}
            {user ? getInitials(user) : "?"}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">
              {/* Fallback to 'Loading...' while fetching */}
              {user || "Loading..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
