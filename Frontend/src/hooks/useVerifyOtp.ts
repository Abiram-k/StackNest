import { HttpService } from "@/api/httpService";
import { UserAuthService } from "@/api/authService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { typeRegisterUserWithOtp } from "../../../types/user";

export const useVerifyOtp = (setIsModalOpen: (value: boolean) => void) => {
  const navigate = useNavigate();
  const httpService = new HttpService();
  const userAuthService = new UserAuthService(httpService);
  
  const {
    mutate: verifyOtpMutate,
    isPending: verifyOtpPending,
    reset: VerifyOtpReset,
  } = useMutation({
    mutationFn: (data: typeRegisterUserWithOtp) =>
      userAuthService.createUser(data),
    onSuccess: (data) => {
      console.log(data);
      toast.success("Otp Verified");
      setIsModalOpen(false);
      navigate("/auth/login");
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      toast.error(error.message || "Something went wrong!");
      VerifyOtpReset();
    },
  });

  return { verifyOtpMutate, verifyOtpPending };
};
