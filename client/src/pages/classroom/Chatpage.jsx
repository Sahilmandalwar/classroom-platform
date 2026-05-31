import { useEffect, useState, useRef } from "react";
import { MessageSquare, Send } from "lucide-react";
import { fetchMessage, sendMessage } from "../../services/messageServices.js";
import { getCurrentUser } from "../../services/authServices.js";
import { useAuth } from "../../contexts/authContext.jsx";
import socket from "../../socket.js";

const ChatPage = ({ activeTab, classroom, onlineUserCount }) => {
  const { currentUserId } = useAuth();
  const [messages, setMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // ✅ ADDED: Chat loading state (Defaults to true)
  const [isChatLoading, setIsChatLoading] = useState(true);

  // Typing state
  const [typingUser, setTypingUser] = useState("");
  const typingTimeoutRef = useRef(null);

  const classId = classroom?._id;
  const messagesEndRef = useRef(null);
  const [currentUserName, setCurrentUserName] = useState("");

  // --- 1. FETCH USER PROFILE (Runs ONCE) ---
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const data = await getCurrentUser();
        setCurrentUserName(data.user.name);
      } catch (error) {
        console.error("Error fetching user detail: ", error?.message);
      }
    };

    fetchUserName();
  }, []);

  // --- 2. FETCH MESSAGES & SOCKETS ---
  useEffect(() => {
    socket.on("messageSent", ({ newMessage }) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("userTyping", ({ userName }) => {
      setTypingUser(userName);
    });

    socket.on("userStoppedTyping", () => {
      setTypingUser("");
    });

    const fetchClassroomMessages = async () => {
      try {
        setIsChatLoading(true); // ✅ Start loading
        const data = await fetchMessage(classId);
        setMessages(data.messages || []);
      } catch (error) {
        console.error("Error fetching messages:", error?.message);
      } finally {
        setIsChatLoading(false); // ✅ Stop loading whether it succeeded or failed
      }
    };

    if (classId && activeTab === "chats") {
      fetchClassroomMessages();
    }

    return () => {
      socket.off("messageSent");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [classId, activeTab]);

  // --- 3. AUTO-SCROLL ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatLoading]); // ✅ Re-scroll when loading finishes

  // --- 4. SEND MESSAGE ---
  const handleSendMessage = async () => {
    if (!typedMessage.trim()) return;

    try {
      setIsSending(true);
      await sendMessage(classId, typedMessage);
      setTypedMessage("");

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socket.emit("stopTyping", { classId });
    } catch (error) {
      console.error("Error sending message:", error?.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // --- 5. EMIT TYPING EVENT ---
  const handleTyping = (e) => {
    const text = e.target.value;
    setTypedMessage(text);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (text.trim() === "") {
      socket.emit("stopTyping", { classId });
      return;
    }

    if (currentUserName) {
      socket.emit("typing", { classId, userName: currentUserName });
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { classId });
    }, 1000);
  };

  if (activeTab !== "chats") return null;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col h-[70dvh] md:h-[90vh] bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between px-4 py-4 md:px-6 md:py-5 border-b bg-slate-900/60 border-slate-800/80 shrink-0">
          <div className="flex items-center justify-around gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 rounded-lg bg-blue-500/10 shrink-0">
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base md:text-lg font-semibold capitalize text-slate-100 truncate">
                  {classroom?.title || classroom?.name || "Classroom Chat"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 truncate">
                  Code: {classroom?.classCode || "N/A"}
                </p>
              </div>
            </div>

            {/* Dynamic Typing Indicator */}
            <div className="min-w-[120px]">
              {typingUser && typingUser !== currentUserName && (
                <p className="text-sm italic text-blue-400 animate-pulse">
                  {typingUser} is typing...
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/50 rounded-full border border-slate-800/50 shrink-0">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-slate-300 hidden sm:inline">
              {onlineUserCount} Online
            </span>
          </div>
        </div>

        {/* --- CHAT AREA --- */}
        <div className="flex flex-col flex-1 overflow-hidden relative bg-slate-950/30">
          {/* Subtle Background Glow for depth */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/5 blur-[100px] pointer-events-none"></div>

          <div className="flex-1 px-4 py-6 md:px-6 space-y-6 overflow-y-auto no-scrollbar relative z-10">
            {/* ✅ ADDED: Premium Skeleton Loader */}
            {isChatLoading ? (
              <div className="flex flex-col space-y-6 animate-pulse opacity-70">
                {/* Skeleton Incoming Message */}
                <div className="flex justify-start">
                  <div className="flex items-end mr-2.5 pb-1 hidden sm:flex">
                    <div className="w-7 h-7 rounded-full bg-slate-800/80"></div>
                  </div>
                  <div className="w-2/3 max-w-[280px] h-20 rounded-2xl bg-slate-800/60 rounded-tl-sm border border-slate-700/30"></div>
                </div>
                {/* Skeleton Outgoing Message */}
                <div className="flex justify-end">
                  <div className="w-1/2 max-w-[220px] h-14 rounded-2xl bg-blue-900/20 rounded-tr-sm border border-blue-800/20"></div>
                </div>
                {/* Skeleton Incoming Message */}
                <div className="flex justify-start">
                  <div className="flex items-end mr-2.5 pb-1 hidden sm:flex">
                    <div className="w-7 h-7 rounded-full bg-slate-800/80"></div>
                  </div>
                  <div className="w-3/4 max-w-[320px] h-24 rounded-2xl bg-slate-800/60 rounded-tl-sm border border-slate-700/30"></div>
                </div>
              </div>
            ) : messages.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-80 animate-fade-in-up">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700/50 shadow-inner">
                  <MessageSquare className="w-8 h-8 text-blue-500/50" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium tracking-wide text-slate-300">
                    It's quiet in here...
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Be the first to start the conversation!
                  </p>
                </div>
              </div>
            ) : (
              // Loaded Messages
              messages.map((msg) => {
                const senderId = msg.sender?._id || msg.sender;
                const isOwnMessage = senderId?.toString() === currentUserId;

                return (
                  <div
                    key={msg._id || msg.id}
                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} animate-fade-in-up`}
                  >
                    {!isOwnMessage && (
                      <div className="flex items-end mr-2.5 pb-1 hidden sm:flex">
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-sm border border-slate-700/50 text-[10px] font-bold text-white uppercase tracking-wider">
                          {msg.sender?.name ? msg.sender.name.charAt(0) : "S"}
                        </div>
                      </div>
                    )}

                    <div
                      className={`relative max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-lg group transition-all duration-200 hover:shadow-xl ${
                        isOwnMessage
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 rounded-tr-sm text-white shadow-blue-900/20 border border-blue-400/30"
                          : "bg-slate-800/80 backdrop-blur-md rounded-tl-sm text-slate-200 border border-slate-700/60 shadow-black/20"
                      }`}
                    >
                      {!isOwnMessage && (
                        <p className="mb-1 text-xs md:text-sm font-semibold tracking-wide text-blue-400">
                          {msg.sender?.name || "Student"}
                        </p>
                      )}

                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {msg.text || msg.message}
                      </p>

                      <div
                        className={`flex justify-end mt-2 items-center gap-1.5 ${isOwnMessage ? "text-blue-200/80" : "text-slate-400"}`}
                      >
                        <span className="text-[10px] font-medium tracking-wider">
                          {msg.time ||
                            new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                        </span>
                        {isOwnMessage && (
                          <svg
                            className="w-3 h-3 opacity-80"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* --- INPUT SECTION --- */}
          <div className="p-3 md:p-5 bg-slate-950/60 backdrop-blur-xl border-t border-slate-800/80 shrink-0 relative z-20">
            <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 border border-slate-700/50 rounded-2xl shadow-inner focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/30 transition-all duration-300">
              <input
                type="text"
                value={typedMessage}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-transparent border-none text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-0"
                onChange={handleTyping}
                onKeyDown={handleKeyDown}
                disabled={isSending || isChatLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!typedMessage.trim() || isSending || isChatLoading}
                className="inline-flex items-center justify-center px-4 py-2.5 font-semibold text-white transition-all duration-200 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-blue-500/25 active:scale-95 gap-2 shrink-0"
              >
                <span className="hidden text-sm sm:inline tracking-wide">
                  {isSending ? "..." : "Send"}
                </span>
                <Send
                  className={`w-4 h-4 ${isSending ? "animate-pulse" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
