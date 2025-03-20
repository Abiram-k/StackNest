import { HttpService } from "@/api/httpService";
import { UserChallengeService } from "@/api/user/userChallengeService";
import { useQuery } from "@tanstack/react-query";

export const useFetchAllSubmittedChallenges = () => {
  const httpService = new HttpService();
  const bannerService = new UserChallengeService(httpService);

  const mutation = useQuery({
    queryKey: ["submitted_challenges"],
    queryFn: () => bannerService.getAllSubmittedChallenges(),
  });

  return mutation;
};
