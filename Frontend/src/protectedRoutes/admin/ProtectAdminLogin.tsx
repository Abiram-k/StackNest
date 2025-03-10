import { RootState } from "@/redux/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectAdminLogin = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.admin);

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}; 

export default ProtectAdminLogin;
