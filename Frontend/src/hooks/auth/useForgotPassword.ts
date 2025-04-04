import { HttpService } from "@/api/httpService";
import { UserAuthService } from "@/api/public/authService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useForgotPassword = (setIsSuccess:(value:boolean)=>void) => {
  const httpService = new HttpService();
  const userAuthService = new UserAuthService(httpService);

  const { mutate, reset, isPending } = useMutation({
    mutationFn: (data:{email:string}) => userAuthService.forgotPassword(data),
    onSuccess: () => {
      setIsSuccess(true);
      reset();
    },
    onError: (error: any) => {
      toast.dismiss();
      toast.error(error.message);
      setIsSuccess(false);
      reset();
    },
  });

  return {mutate,isPending};
};
