import { HttpService } from "@/api/httpService";
import { UserAuthService } from "@/api/public/authService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLogout = () => {
  const httpService = new HttpService();
  const userAuthService = new UserAuthService(httpService);
  const mutation = useMutation({
    mutationFn: (role:string) => userAuthService.logout(role),
    onSuccess: () => {
      toast.success("Logged out");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to log out");
    },
  });
  return { ...mutation };
};
