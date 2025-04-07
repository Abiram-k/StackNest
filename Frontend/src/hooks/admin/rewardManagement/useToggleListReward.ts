import { HttpService } from "@/api/httpService";
import { RewardService } from "@/api/public/rewardService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useToggleListReward = () => {
  const httpService = new HttpService();
  const rewardService = new RewardService(httpService);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (rewardId: string) => rewardService.toggleListing(rewardId),
    onSuccess: () => {
      toast.success("Action done");
      queryClient.invalidateQueries({ queryKey: ["Rewards"] });
    },
    onError: () => {
      toast.error("Action undone");
    },
  });

  return { ...mutation };
};
