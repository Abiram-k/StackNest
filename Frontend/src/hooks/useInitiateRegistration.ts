import { HttpService } from "@/api/httpService";
import { UserAuthService } from "@/api/user/userAuthService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

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
      console.log(data);
      toast.success("Otp Sended to your Gmail");
      setIsModalOpen(true);
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      toast.error(error.message || "Something went wrong!");
      initiatingReset();
    },
  });

  return { initiateRegistrationMutate, initiatingPending };
};
