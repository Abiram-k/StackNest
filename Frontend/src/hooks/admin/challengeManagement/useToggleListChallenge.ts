import { BannerService } from "@/api/admin/bannerServices";
import { ChallengeService } from "@/api/admin/challengeService";
import { HttpService } from "@/api/httpService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useToggleListingChallenge = () => {
  const httpService = new HttpService();
  const challengeService = new ChallengeService(httpService);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (challengeId: string) =>
      challengeService.toggleListing(challengeId),
    onSuccess: () => {
      toast.dismiss();
      toast.success("Action Success");
      queryClient.invalidateQueries({ queryKey: ["challenge"] });
    },
    onError: () => {
      toast.dismiss();
      toast.error(" Action Failed");
    },
  });

  return { ...mutation };
};
