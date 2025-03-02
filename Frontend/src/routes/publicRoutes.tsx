import { lazy } from "react";
import { Outlet, RouteObject } from "react-router-dom";

import ProtectLogin from "@/protectedRoutes/user/ProtectLogin";
const LoginPage = lazy(() => import("../pages/user/auth/UserLogin"));
const RegisterPage = lazy(() => import("../pages/user/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/user/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/user/auth/ResetPassword"));

const LandingPage = lazy(() => import("../pages/user/pages/LandingPage"));

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ProtectLogin>
        <LandingPage />
      </ProtectLogin>
    ),
  },
  {
    path: "/auth",
    element: (
      <ProtectLogin>
        <Outlet />
      </ProtectLogin>
    ),
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "verify-email", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },
];
