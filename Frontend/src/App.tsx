import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Spinner } from "./components/ui/spinner";
import ProtectHome from "./protectedRoutes/user/ProtectHome";
import ProtectLogin from "./protectedRoutes/user/ProtectLogin";
import ProfilePage from "./pages/user/others/Profile";
import ProfileLayout from "./layouts/ProfileLayout";
import AboutPage from "./pages/user/others/AboutPage";
import ContactPage from "./pages/user/others/ContactPage";
import { getUserProfile } from "./api/user/userapi";

const Layout = lazy(() => import("./layouts/Layout"));
const HomePage = lazy(() => import("./pages/user/others/HomePage"));
const LandingPage = lazy(() => import("./pages/user/others/LandingPage"));
const LoginPage = lazy(() => import("./pages/user/auth/UserLogin"));
const RegisterPage = lazy(() => import("./pages/user/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/user/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/user/auth/ResetPassword"));
const AdminLoginPage = lazy(() => import("./pages/admin/auth/AdminLogin"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route
          index
          element={
            <ProtectLogin>
              <LandingPage />
            </ProtectLogin>
          }
        />
        <Route
          path="auth"
          element={
            <ProtectLogin>
              <Outlet />
            </ProtectLogin>
          }
        >
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify-email" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="user" element={<Layout />}>
          <Route
            path="home"
            element={
              <ProtectHome>
                <HomePage />
              </ProtectHome>
            }
          />
          <Route path="about" element={<AboutPage/>}/>
          <Route path="contact" element={<ContactPage/>}/>
          <Route path="profile" element={<ProfileLayout />}>
            <Route index element={<ProfilePage />}/>

          </Route>
        </Route>

        <Route path="admin">
          <Route path="auth">
            <Route path="login" element={<AdminLoginPage />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route>
    )
  );

  return (
    <>
      <Toaster />
      <Suspense fallback={<Spinner />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}

export default App;
