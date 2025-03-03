import { HttpService } from "@/api/httpService";
import { UserAuthService } from "@/api/authService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useResetPassword = () => {
    
  const navigate = useNavigate();
  const httpService = new HttpService();
  const userAuthService = new UserAuthService(httpService);

  const { mutate, reset, isPending } = useMutation({
    mutationFn: (data: { token?: string; password: string }) =>
      userAuthService.resetPassword(data),
    onSuccess: () => {
      toast.success("Password updated ");
      navigate("/auth/login");
      reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to updated Password");
      reset();
    },
  });

  return { mutate, isPending };
};
