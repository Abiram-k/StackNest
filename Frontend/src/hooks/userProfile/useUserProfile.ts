import { HttpService } from "@/api/httpService";
import { UserProfileService } from "@/api/user/userProfileService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  axiosResponse,
  verifyUserProfileSchemaType,
} from "../../../../types/user";
import toast from "react-hot-toast";

const userProfileService = new UserProfileService(new HttpService());

// Hook to fetch user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userDetails"],
    queryFn: () => userProfileService.getUserProfile(),
  });
};

// Hook to udtate user profile
export const useUpdateUserProfile = (
  setIsEditing: (value: boolean) => void
) => {
  const queryClient = useQueryClient();
  const {
    mutate: updateMutation,
    isPending,
    isError,
    reset,
  } = useMutation({
    mutationFn: (data: verifyUserProfileSchemaType) =>
      userProfileService.updateUserProfile(data),
    onSuccess: (data: axiosResponse) => {
      console.log(data);
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["userDetails"] });
      toast.dismiss();
      toast.success("Profile updated");
    },
    onError: (error: any) => {
      reset();
      toast.dismiss();
      toast.error(error.message || "Something went wrong!");
    },
  });

  return { updateMutation, isError, isPending };
};
