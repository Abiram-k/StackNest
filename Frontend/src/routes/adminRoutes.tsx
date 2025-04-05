import AdminLayout from "@/layouts/AdminLayout";
import ProtectAdminLogin from "@/protectedRoutes/admin/ProtectAdminLogin";
import ProtectDashboard from "@/protectedRoutes/admin/ProtectDashboard";
import { lazy } from "react";
const AdminLoginPage = lazy(() => import("../pages/admin/auth/AdminLogin"));
const Dashboard = lazy(() => import("../pages/admin/pages/Dashboard"));
const RoomManagement = lazy(
  () => import("@/pages/admin/pages/roomManagement/RoomManagement")
);
const FeedManagement = lazy(
  () => import("@/pages/admin/pages/feedManagement/FeedManagement")
);
const FeedDetails = lazy(
  () => import("@/pages/admin/pages/feedManagement/FeedDetails")
);
const UserManagement = lazy(
  () => import("@/pages/admin/pages/userManagement/UserManagement")
);
const RoomDetails = lazy(
  () => import("@/pages/admin/pages/roomManagement/RoomDetails")
);
const RoomSessionHistory = lazy(
  () => import("@/pages/admin/pages/roomManagement/RoomSessionHistory")
);

const BenefitsManagment = lazy(
  () => import("@/pages/admin/pages/benefitsManagement/BenefitsManagment")
);
const CreateBenefits = lazy(
  () => import("@/pages/admin/pages/benefitsManagement/CreateBenefits")
);
const UpdateBenefits = lazy(
  () => import("@/pages/admin/pages/benefitsManagement/UpdateBenefits")
);
const PremiumManagement = lazy(
  () => import("@/pages/admin/pages/premiumManagement/PremiumManagement")
);
const CreatePremium = lazy(
  () => import("@/pages/admin/pages/premiumManagement/CreatePremium")
);
const UpdatePremium = lazy(
  () => import("@/pages/admin/pages/premiumManagement/UpdatePremium")
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
          {
            path: "room-management/:roomId/details/history",
            element: <RoomSessionHistory />,
          },

          // Banner management
          { path: "banner-management", element: <BannerManagement /> },
          { path: "banner-management/add", element: <AddBanner /> },
          { path: "banner-management/:bannerId/edit", element: <EditBanner /> },

          // Benefits managment
          { path: "benefits-management", element: <BenefitsManagment /> },
          { path: "benefits-management/add", element: <CreateBenefits /> },
          {
            path: "benefits-management/:benefitId/edit",
            element: <UpdateBenefits />,
          },

          // Premium plan managment
          { path: "plans-management", element: <PremiumManagement /> },
          { path: "plans-management/add", element: <CreatePremium /> },
          {
            path: "plans-management/:premiumId/edit",
            element: <UpdatePremium />,
          },

          // Challenge management
          { path: "challenge-management", element: <ChallengeManagment /> },
          { path: "challenge-management/add", element: <AddChallenge /> },
          {
            path: "challenge-management/:challengeId/edit",
            element: <UpdateChallenge />,
          },
          {
            path: "feed-management",
            element: <FeedManagement />,
          },
          {
            path: "feed-management/:feedId/details",
            element: <FeedDetails />,
          },
        ],
      },
    ],
  },
];
