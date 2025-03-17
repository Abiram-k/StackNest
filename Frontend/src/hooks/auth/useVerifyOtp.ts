import { HttpService } from "@/api/httpService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { typeRegisterUserWithOtp } from "../../../../types/user";
import { UserAuthService } from "@/api/public/authService";

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
      toast.dismiss();
      toast.success("Otp Verified");
      setIsModalOpen(false);
      navigate("/auth/login");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message || "Something went wrong!");
      VerifyOtpReset();
    },
  });

  return { verifyOtpMutate, verifyOtpPending };
};
