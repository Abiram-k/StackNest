import AdminLayout from "@/layouts/AdminLayout";
import Dashboard from "@/pages/admin/pages/Dashboard";
import UserManagement from "@/pages/admin/pages/UserManagement";
import { lazy } from "react";
const AdminLoginPage = lazy(() => import("../pages/admin/auth/AdminLogin"));
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
