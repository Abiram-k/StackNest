import { HttpService } from "@/api/httpService";
import { UserProfileService } from "@/api/user/userProfileService";
import { useQuery } from "@tanstack/react-query";

export const useGetStreakCount = () => {
  const userProfileService = new UserProfileService(new HttpService());

  return useQuery({
    queryKey: ["streakCount"],
    queryFn: () => userProfileService.getStreakCount(),
  });
};
