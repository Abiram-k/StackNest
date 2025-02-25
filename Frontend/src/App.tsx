import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import { LoginPage } from "./pages/user/Login";
import { Toaster } from "react-hot-toast";
import { PageNotFound } from "./pages/PageNotFound";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<Navigate to="user/auth/login" replace />} />
        <Route path="user">
          
        <Route path="auth">
          <Route path="login" element={<LoginPage />} />
          {/* <Route path='register' element={<RegisterPage />} /> */}
        </Route>


        </Route>
        <Route path="*" element={<PageNotFound/>} />
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
