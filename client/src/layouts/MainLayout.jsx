import {Outlet} from 'react-router-dom';
import Navbar from '../components/navbar.jsx';


import { useEffect } from "react";
import socket from '../socket.js';
import { useAuth } from '../contexts/authContext.jsx';

import { useState } from "react";




const MainLayout = () => {
  const { currentUserId } = useAuth();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleConnect = () => {
      if (currentUserId) {
        socket.emit("joinUserRoom", currentUserId);
        console.log("Global Socket connected for user:", currentUserId);
      }
    };

    if (socket.connected) {
      handleConnect();
    }

    socket.on("connect", handleConnect);

    socket.on("annoucementNotification", (data) => {
      setNotifications((prev) => [data.notification, ...prev]);
    });
    socket.on("notesNotification", (data) => {
      setNotifications((prev) => [data.notification, ...prev]);
    });
    socket.on("sessionNotification", (data) => {
      setNotifications((prev) => [data.notification, ...prev]);
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("annoucementNotification");
      socket.off("notesNotification");
      socket.off("sessionNotification");



    };
  }, [currentUserId]);

  return (
    <div className="min-h-screen bg-black">
      <Navbar notifications={notifications} setNotifications={setNotifications}/>
      <Outlet />
    </div>
  )
}

export default MainLayout
