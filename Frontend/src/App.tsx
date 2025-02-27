import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import { LoginPage } from "./pages/user/auth/Login";
import { Toaster } from "react-hot-toast";
import { PageNotFound } from "./pages/PageNotFound";
import { RegisterPage } from "./pages/user/auth/Register";
import { ForgotPassword } from "./pages/user/auth/ForgotPassword";
import { ResetPassword } from "./pages/user/auth/ResetPassword";
import { AdminLoginPage } from "./pages/admin/auth/Login";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<Navigate to="user/auth/login" replace />} />
        <Route path="user">
          <Route path="auth">
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="verify-email" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
        </Route>
        <Route path="admin">
          <Route path="login" element={<AdminLoginPage />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route>
    )
  );

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
