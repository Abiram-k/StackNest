import { RootState } from "@/redux/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useSocket } from "@/lib/socket";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectHome = ({ children }: { children: ReactNode }) => {
  const socket = useSocket();
  const navigate = useNavigate();
  useEffect(() => {
    socket.on("incoming-calll", (recieverId: string) => {
      alert("hai");
      navigate(`/user/messaging?friend=${recieverId}`);
    });
    return () => {
      socket.off("incoming-calll");
    };
  }, []);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectHome;
