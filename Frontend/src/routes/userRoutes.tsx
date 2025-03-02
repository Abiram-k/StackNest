import ProfileLayout from "@/layouts/ProfileLayout";
import ProtectHome from "@/protectedRoutes/user/ProtectHome";
import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const ProfilePage = lazy(() => import("../pages/user/pages/ProfilePage"));
const AboutPage = lazy(() => import("../pages/user/pages/AboutPage"));
const ContactPage = lazy(() => import("../pages/user/pages/ContactPage"));
const Layout = lazy(() => import("../layouts/Layout"));
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
      {
        path: "profile",
        element: <ProfileLayout />,
        children: [{ index: true, element: <ProfilePage /> }],
      },
    ],
  },
];
