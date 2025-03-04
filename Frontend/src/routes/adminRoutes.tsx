import AdminLayout from "@/layouts/AdminLayout";
import { lazy } from "react";
const AdminLoginPage = lazy(() => import("../pages/admin/auth/AdminLogin"));
const Dashboard = lazy(() => import("../pages/admin/pages/Dashboard"));
const UserManagement = lazy(() => import("../pages/admin/pages/UserManagement"));

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
        ],
      },
    ],
  },
];
