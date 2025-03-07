import AdminLayout from "@/layouts/AdminLayout";
import { lazy } from "react";

const AdminLoginPage = lazy(() => import("../pages/admin/auth/AdminLogin"));
const Dashboard = lazy(() => import("../pages/admin/pages/Dashboard"));
const RoomManagement = lazy(() => import("@/pages/admin/pages/RoomManagement"));
const UserManagement = lazy(() => import("@/pages/admin/pages/UserManagement"));
const RoomDetails = lazy(() => import("@/pages/admin/pages/RoomDetails"));

import { RouteObject } from "react-router-dom";

export const adminRoutes: RouteObject[] = [
  {
    path: "admin",
    children: [
      {
        path: "auth",
        children: [{ path: "login", element: <AdminLoginPage /> }],
      },
      {
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "user-management", element: <UserManagement /> },
          { path: "room-management", element: <RoomManagement /> },
          {
            path: "room-management/:roomId/details",
            element: <RoomDetails />,
          },
        ],
      },
    ],
  },
];
