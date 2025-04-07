import { HttpService } from "@/api/httpService";
import { RewardService } from "@/api/public/rewardService";
import { ReqReward } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useUpdateReward = () => {
  const httpService = new HttpService();
  const rewardService = new RewardService(httpService);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: ({ rewardId, data }: { rewardId: string; data: ReqReward }) =>
      rewardService.updateReward(rewardId, data),
    onSuccess: () => {
      toast.success("reward updated");
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      navigate(-1);
    },
    onError: () => {
      toast.error("Failed to updat reward");
    },
  });

  return { ...mutation };
};
