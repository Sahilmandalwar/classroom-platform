import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import Signup from "../pages/Signup.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import ProtectedRoute from "../components/protectedRoute.jsx";
import ClassroomPage from "../pages/classroom/ClassroomPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import GuestMode from "../components/guestMode.jsx";
import InvalidPage from "../pages/InvalidPage.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

import DashBoardClassroom from "../pages/dashboard/DashBoardClassroom.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <GuestMode>
            <HomePage />
          </GuestMode>
        ),
      },
      {
        path: "/login",
        element: (
          <GuestMode>
            <Login />
          </GuestMode>
        ),
      },
      {
        path: "/signup",
        element: (
          <GuestMode>
            <Signup />
          </GuestMode>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "classrooms",
            element: (
             <DashBoardClassroom />
            ),
          },
        ],
      },
      {
        path: "/classroom/:classId",
        element: (
          <ProtectedRoute>
            <ClassroomPage />
          </ProtectedRoute>
        ),
      },
     
      {
        path: "/*",
        element: <InvalidPage />,
      },
    ],
  },
]);

export default router;
