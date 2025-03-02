
import { HttpService } from "@/api/httpService";
import { UserProfileService } from "@/api/user/userProfileService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const userProfileService = new UserProfileService(new HttpService())

// Hook to fetch user profile
export const useUserProfile = () => {
 
 return useQuery({
    queryKey: ["userDetails"],
    queryFn:()=> userProfileService.getUserProfile(),
  });
};

// export const useUpdateUserProfile = () => {
//   const queryClient = useQueryClient();

//   return useMutation(updateUserProfile, {
//     onSuccess: () => {
//       queryClient.invalidateQueries(["userDetails"]); // Refetch profile after update
//     },
//   });
// };
