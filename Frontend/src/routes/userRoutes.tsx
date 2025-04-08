import ProfileLayout from "@/layouts/ProfileLayout";
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import ProtectHome from "@/protectedRoutes/user/ProtectHome";
import RewardsPage from "@/pages/user/pages/RewardsPage";

const VideoConference = lazy(
  () => import("@/pages/user/pages/VideoConference")
);
const DailyChallengePage = lazy(
  () => import("@/pages/user/pages/DailyChallengePage")
);
const Favourites = lazy(() => import("@/pages/user/pages/Favorites"));
const Leaderboard = lazy(() => import("@/pages/user/pages/Leaderboard"));
const SettingsPage = lazy(() => import("@/pages/user/pages/Settings"));
const PaymentListPage = lazy(() => import("@/pages/user/pages/PaymentList"));
const SingleFeed = lazy(() => import("@/pages/user/pages/SingleFeed"));
const Highlights = lazy(() => import("@/pages/user/pages/Highlights"));
const PremiumPlans = lazy(() => import("@/pages/user/pages/PremiumPlans"));
const MyFeeds = lazy(() => import("@/pages/user/pages/MyFeeds"));
const CreateFeed = lazy(() => import("@/pages/user/pages/CreateFeed"));
const UpdateFeed = lazy(() => import("@/pages/user/pages/UpdateFeed"));
const EditRoom = lazy(() => import("@/pages/user/pages/EditRoom"));
const CreateRoom = lazy(() => import("@/pages/user/pages/CreateRoom"));
const RoomsListPage = lazy(() => import("../pages/user/pages/RoomListPage"));
const ProfilePage = lazy(() => import("../pages/user/pages/ProfilePage"));
const AboutPage = lazy(() => import("../pages/user/pages/AboutPage"));
const ContactPage = lazy(() => import("../pages/user/pages/ContactPage"));
const Layout = lazy(() => import("../layouts/UserLayout"));
const HomePage = lazy(() => import("../pages/user/pages/HomePage"));

export const userRoutes: RouteObject[] = [
  {
    path: "user",
    element: (
      <ProtectHome>
        <Layout />
      </ProtectHome>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "home", element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "favorites", element: <Favourites /> },
      {
        path: "room",
        element: <RoomsListPage />,
      },
      { path: "room/create", element: <CreateRoom /> },
      { path: "room/:roomId/edit", element: <EditRoom /> },
      { path: "room/:roomId/conference", element: <VideoConference /> },
      { path: "challenge", element: <DailyChallengePage /> },
      { path: "highlights", element: <Highlights /> },
      { path: "highlights/:feedId", element: <SingleFeed /> },
      {
        path: "profile",
        element: <ProfileLayout />,
        children: [
          { index: true, element: <ProfilePage /> },
          {
            path: "stats",
            element: <Leaderboard />,
          },
          { path: "stats/rewards", element: <RewardsPage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "premium-plans", element: <PremiumPlans /> },
          { path: "premium-plans/:planId/payment", element: <PaymentListPage /> },
          { path: "my-feeds", element: <MyFeeds /> },
          { path: "my-feed/:feedId/edit", element: <UpdateFeed /> },
          { path: "feed/upload", element: <CreateFeed /> },
        ],
      },
    ],
  },
];
