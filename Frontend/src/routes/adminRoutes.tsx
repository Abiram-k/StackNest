import AdminLayout from "@/layouts/AdminLayout";
import ProtectAdminLogin from "@/protectedRoutes/admin/ProtectAdminLogin";
import ProtectDashboard from "@/protectedRoutes/admin/ProtectDashboard";
import { lazy } from "react";

const EditBanner = lazy(() => import("../pages/admin/pages/EditBanner"));
const AddBanner = lazy(() => import("../pages/admin/pages/AddBanner"));
const AdminLoginPage = lazy(() => import("../pages/admin/auth/AdminLogin"));
const Dashboard = lazy(() => import("../pages/admin/pages/Dashboard"));
const RoomManagement = lazy(() => import("@/pages/admin/pages/RoomManagement"));
const UserManagement = lazy(() => import("@/pages/admin/pages/UserManagement"));
const RoomDetails = lazy(() => import("@/pages/admin/pages/RoomDetails"));
const BannerManagement = lazy(
  () => import("@/pages/admin/pages/BannerManagement")
);

import { RouteObject } from "react-router-dom";

export const adminRoutes: RouteObject[] = [
  {
    path: "admin",
    children: [
      {
        path: "auth",
        children: [
          {
            path: "login",
            element: (
              <ProtectAdminLogin>
                <AdminLoginPage />
              </ProtectAdminLogin>
            ),
          },
        ],
      },
      {
        element: (
          <ProtectDashboard>
            <AdminLayout />
          </ProtectDashboard>
        ),
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "user-management", element: <UserManagement /> },
          { path: "room-management", element: <RoomManagement /> },
          {
            path: "room-management/:roomId/details",
            element: <RoomDetails />,
          },
          { path: "banner-management", element: <BannerManagement /> },
          { path: "banner-management/add", element: <AddBanner /> },
          { path: "banner-management/:bannerId/edit", element: <EditBanner /> },
        ],
      },
    ],
  },
];
