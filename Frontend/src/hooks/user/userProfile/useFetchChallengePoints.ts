import { HttpService } from "@/api/httpService";
import { UserProfileService } from "@/api/user/userProfileService";
import { useQuery } from "@tanstack/react-query";

export const useFetchChallengePoints = () => {
  const userProfileService = new UserProfileService(new HttpService());

  return useQuery({
    queryKey: ["challengePoints"],
    queryFn: () => userProfileService.fetchChallengePoints(),
  });

};
