import { HttpService } from "@/api/httpService";
import { UserChallengeService } from "@/api/user/userChallengeService";
import { useQuery } from "@tanstack/react-query";

export const useFetchChallenges = () => {
  const httpService = new HttpService();
  const bannerService = new UserChallengeService(httpService);

  const mutation = useQuery({
    queryKey: ["challenge"],
    queryFn: () => bannerService.fetchChallenges(),
  });

  return mutation;
};
