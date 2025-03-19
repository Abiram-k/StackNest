import { axiosInstancePublic } from "@/api/apiSevice";
import { setUserCredentials } from "@/redux/slice/userSlice";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const useGitHubTokenValidation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (error) {
      alert(`GitHub Authentication Failed: ${error}`);
      navigate("/auth/login");
      return;
    }

    if (token) {
      validateToken(token);
    }
  }, [navigate]);

  const validateToken = async (token: string) => {
    try {
      const { data } = await axiosInstancePublic.get(
        `${BASE_URL}/auth/validate/github/token`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        dispatch(setUserCredentials({}));
      } else {
        console.error("Invalid token:", data.message);
        toast.error("Token is invalid or expired. Please log in again.");
      }
    } catch (error) {
      console.error("Token validation error:", error);
      alert("Error validating token. Redirecting to login.");
    }
  };
};

export default useGitHubTokenValidation;
