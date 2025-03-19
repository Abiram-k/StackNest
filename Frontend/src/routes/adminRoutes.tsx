import AdminLayout from "@/layouts/AdminLayout";
import ProtectAdminLogin from "@/protectedRoutes/admin/ProtectAdminLogin";
import ProtectDashboard from "@/protectedRoutes/admin/ProtectDashboard";
import { lazy } from "react";

const AdminLoginPage = lazy(() => import("../pages/admin/auth/AdminLogin"));
const Dashboard = lazy(() => import("../pages/admin/pages/Dashboard"));
const RoomManagement = lazy(
  () => import("@/pages/admin/pages/roomManagement/RoomManagement")
);
const UserManagement = lazy(
  () => import("@/pages/admin/pages/userManagement/UserManagement")
);
const RoomDetails = lazy(
  () => import("@/pages/admin/pages/roomManagement/RoomDetails")
);
const BannerManagement = lazy(
  () => import("@/pages/admin/pages/bannerManagement/BannerManagement")
);
const EditBanner = lazy(
  () => import("../pages/admin/pages/bannerManagement/EditBanner")
);
const AddBanner = lazy(
  () => import("../pages/admin/pages/bannerManagement/AddBanner")
);
const ChallengeManagment = lazy(
  () => import("@/pages/admin/pages/challengeManagement/ChallengeManagment")
);
const AddChallenge = lazy(
  () => import("@/pages/admin/pages/challengeManagement/AddChallenge")
);
const UpdateChallenge = lazy(
  () => import("@/pages/admin/pages/challengeManagement/UpdateChallenge")
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

          // Room manangement
          { path: "room-management", element: <RoomManagement /> },
          {
            path: "room-management/:roomId/details",
            element: <RoomDetails />,
          },

          // Banner management
          { path: "banner-management", element: <BannerManagement /> },
          { path: "banner-management/add", element: <AddBanner /> },
          { path: "banner-management/:bannerId/edit", element: <EditBanner /> },
          
          // Challenge management
          { path: "challenge-management", element: <ChallengeManagment /> },
          { path: "challenge-management/add", element: <AddChallenge /> },
          { path: "challenge-management/:challengeId/edit", element: <UpdateChallenge /> },
        ],
      },
    ],
  },
];
