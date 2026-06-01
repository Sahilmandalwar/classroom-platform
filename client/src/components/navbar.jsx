

import { readAllNotification } from "../services/notificationServices.js";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContext.jsx";
import { Bell, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = ({ notifications = [], setNotifications }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu automatically when the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleReadAllNotification = async () => {
    try {
      const data = await readAllNotification();
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    } catch (error) {
      console.log("handleReadNotificationError: ", error.message);
    }
  };

  return (
    // ✨ UPGRADE: Added sticky positioning and backdrop blur for a premium glass effect
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80">
      {/* Logo */}
      <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-purple-600">
        Classroom
      </h1>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4 md:gap-6">
        {isAuthenticated && (
          // Notification Bell (Visible on both Mobile and Desktop)
          <div className="relative flex items-center">
            <button
              onClick={() => {
                if (!showNotifications) {
                  handleReadAllNotification();
                }
                setShowNotifications((prev) => !prev);
                setIsMobileMenuOpen(false); // Close mobile menu if opening notifications
              }}
              className="relative text-zinc-300 hover:text-purple-400 transition-colors p-1"
            >
              <Bell size={22} className="md:w-6 md:h-6" />

              {notifications.filter((n) => !n.isRead).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold min-w-4.5 h-4.5 flex items-center justify-center rounded-full px-1 border-2 border-zinc-950">
                  {notifications.filter((n) => !n.isRead).length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-4 w-[85vw] sm:w-80 max-w-sm bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/80 rounded-2xl shadow-2xl p-4 z-50 max-h-[70vh] overflow-y-auto origin-top-right animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-semibold text-lg">
                    Notifications
                  </h2>
                </div>

                {notifications.length === 0 ? (
                  <p className="text-zinc-400 text-sm text-center py-4">
                    No notifications yet
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {notifications.map((item, index) => (
                      <div
                        key={index}
                        className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-3 hover:bg-zinc-700/70 transition"
                      >
                        <p className="text-sm text-zinc-100 leading-relaxed">
                          {item.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
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
        )}

        {/* --- DESKTOP MENU (Hidden on small screens) --- */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-zinc-300 hover:text-purple-400 font-medium transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-purple-600/10 text-purple-400 border border-purple-500/30 hover:bg-purple-600 hover:text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-zinc-300 hover:text-cyan-400 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-cyan-900/20 transition-all active:scale-95"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* --- MOBILE HAMBURGER TOGGLE (Hidden on desktop) --- */}
        <button
          onClick={() => {
            setIsMobileMenuOpen(!isMobileMenuOpen);
            setShowNotifications(false); // Close notifications if opening menu
          }}
          className="md:hidden p-1 text-zinc-400 hover:text-white transition-colors focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/80 shadow-2xl flex flex-col md:hidden animate-fade-in-up origin-top">
          <div className="flex flex-col p-4 gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-zinc-200 font-medium hover:text-purple-400 hover:bg-zinc-900/50 p-3 rounded-xl transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-purple-600/10 text-purple-400 border border-purple-500/30 hover:bg-purple-600 hover:text-white px-4 py-3 rounded-xl font-semibold transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-zinc-200 font-medium hover:text-cyan-400 hover:bg-zinc-900/50 p-3 rounded-xl transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="w-full text-center bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-3 rounded-xl font-semibold shadow-lg shadow-cyan-900/20 transition-all"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;