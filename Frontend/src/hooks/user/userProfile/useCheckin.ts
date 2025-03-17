import { HttpService } from "@/api/httpService";
import { UserProfileService } from "@/api/user/userProfileService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCheckin = () => {
  const httpService = new HttpService();
  const profileService = new UserProfileService(httpService);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => profileService.checkin(),
    onSuccess: () => {
      toast.dismiss();
      toast.success("Successfully checked in");
      queryClient.invalidateQueries({ queryKey: ["streakCount"] });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message || "Failed to checkin");
    },
  });

  return { ...mutation };
};
