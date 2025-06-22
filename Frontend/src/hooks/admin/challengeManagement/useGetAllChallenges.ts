import { ChallengeService } from "@/api/admin/challengeService";
import { HttpService } from "@/api/httpService";
import { useQuery } from "@tanstack/react-query";

export const useGetAllChallenges = ({
  currentPage,
}: {
  currentPage?: number;
}) => {
  const httpService = new HttpService();
  const bannerService = new ChallengeService(httpService);

  const mutation = useQuery({
    queryKey: ["challenge", currentPage],
    queryFn: () => bannerService.getAllChallenges(currentPage),
  });

  return mutation;
};
