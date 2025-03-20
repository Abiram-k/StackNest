import ProfileLayout from "@/layouts/ProfileLayout";
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import ProtectHome from "@/protectedRoutes/user/ProtectHome";

const DailyChallengePage = lazy(
  () => import("@/pages/user/pages/DailyChallengePage")
);
const Favourites = lazy(() => import("@/pages/user/pages/Favorites"));
const SettingsPage = lazy(() => import("@/pages/user/pages/Settings"));
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
      { path: "challenge", element: <DailyChallengePage /> },
      {
        path: "profile",
        element: <ProfileLayout />,
        children: [
          { index: true, element: <ProfilePage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
];
