
import {
  readNotification,
  readAllNotification,
} from "../services/notificationServices.js";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext.jsx";
import { Bell } from "lucide-react";
import { useState } from "react";

const Navbar = ({ notifications = [], setNotifications }) => {
  const { isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleReadAllNotification=async()=>{
    try{
      const data = await readAllNotification();
      setNotifications((prev)=>
        prev.map((notification)=>({
          ...notification, 
          isRead : true
      })
    ));

    }catch(error){
      console.log("handleReadNotificationError: ", error.message);
    }
  }

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-zinc-950 border-b border-zinc-800 relative">
      <h1 className="text-2xl font-bold text-purple-400">AI Classroom</h1>

      <div className="flex items-center gap-6">
        {isAuthenticated ? (
          <>
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {

                  if(!showNotifications) {
                    handleReadAllNotification();
                  }
                  setShowNotifications((prev) => !prev);
                  
                }}
                className="relative text-white hover:text-purple-400 transition"
              >
                <Bell size={24} />

                {notifications.filter((n) => !n.isRead ).length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] min-w-5 h-5 flex items-center justify-center rounded-full px-1">
                    {notifications.filter((n) => !n.isRead ).length}
                  </span>
                )}
              </button>

              
              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-4 z-50 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-semibold text-lg">
                      Notifications
                    </h2>
                  </div>

                  {notifications.length ===
                  0 ? (
                    <p className="text-zinc-400 text-sm">
                      No notifications yet
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {notifications.map((item, index) => (
                        <div
                          key={index}
                          className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 hover:bg-zinc-700/70 transition"
                        >
                          <p className="text-sm text-white leading-relaxed">
                            {item.message}
                          </p>

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-purple-400 uppercase tracking-wide">
                              {item.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dashboard Link */}
            <Link
              to="/dashboard"
              className="text-white hover:text-purple-400 transition"
            >
              Dashboard
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-white transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-white hover:text-cyan-400 transition"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg text-white transition"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;