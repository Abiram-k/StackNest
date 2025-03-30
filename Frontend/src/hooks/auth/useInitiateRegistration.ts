import { HttpService } from "@/api/httpService";
import { UserAuthService } from "@/api/public/authService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useInitiateRegistration = (
  setIsModalOpen: (value: boolean) => void
) => {
  const httpService = new HttpService();
  const userAuthService = new UserAuthService(httpService);

  const {
    mutate: initiateRegistrationMutate,
    isPending: initiatingPending,
    reset: initiatingReset,
  } = useMutation({
    mutationFn: (data:{ email:string}) => userAuthService.initiateRegistration(data),
    onSuccess: (data) => {
      setIsModalOpen(true);
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      toast.dismiss();
      toast.error(error.message || "Something went wrong!");
      initiatingReset();
    },
  });

  return { initiateRegistrationMutate, initiatingPending };
};
