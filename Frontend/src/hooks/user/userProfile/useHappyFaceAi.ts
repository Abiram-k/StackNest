import { HttpService } from "@/api/httpService";
import { UserProfileService } from "@/api/user/userProfileService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useHappyFaceAi = () => {
  const userProfileService = new UserProfileService(new HttpService());

  const mutation = useMutation({
    mutationFn: (prompt: string) =>
      userProfileService.getOpenAiResponse(prompt),
    onError: (error) => {
      // toast.error(error.message || "Failed to get OpenAi response");
    },
  });

  return { ...mutation };
};
