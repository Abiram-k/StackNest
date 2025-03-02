import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Spinner } from "./components/ui/spinner";
import { appRouter } from "./routes/router";

function App() {
  // const router = createBrowserRouter(
  //   createRoutesFromElements(
  //     <Route path="/">
  //       <Route
  //         index
  //         element={
  //           <ProtectLogin>
  //             <LandingPage />
  //           </ProtectLogin>
  //         }
  //       />
  //       <Route
  //         path="auth"
  //         element={
  //           <ProtectLogin>
  //             <Outlet />
  //           </ProtectLogin>
  //         }
  //       >
  //         <Route path="login" element={<LoginPage />} />
  //         <Route path="register" element={<RegisterPage />} />
  //         <Route path="verify-email" element={<ForgotPassword />} />
  //         <Route path="reset-password" element={<ResetPassword />} />
  //       </Route>


  //       <Route
  //         path="user"
  //         element={
  //           <ProtectHome>
  //             <Layout />
  //           </ProtectHome>
  //         }
  //       >
  //         <Route path="home" element={<HomePage />} />
  //         <Route path="about" element={<AboutPage />} />
  //         <Route path="contact" element={<ContactPage />} />
  //         <Route path="profile" element={<ProfileLayout />}>
  //           <Route index element={<ProfilePage />} />
  //         </Route>
  //       </Route>

  //       <Route path="admin">
  //         <Route path="auth">
  //           <Route path="login" element={<AdminLoginPage />} />
  //         </Route>
  //       </Route>
  //       <Route path="*" element={<PageNotFound />} />
  //     </Route>
  //   )
  // );

  return (
    <>
      <Toaster />
      <Suspense fallback={<Spinner />}>
        <RouterProvider router={appRouter} />
      </Suspense>
    </>
  );
}

export default App;
