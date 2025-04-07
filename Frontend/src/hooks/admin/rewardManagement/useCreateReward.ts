import { HttpService } from "@/api/httpService";
import { RewardService } from "@/api/public/rewardService";
import {  ReqReward } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useCreateReward = () => {
  const httpService = new HttpService();
  const rewardService = new RewardService(httpService);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (data: ReqReward) => rewardService.addReward(data),
    onSuccess: () => {
      toast.success("New reward added");
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      navigate(-1);
    },
    onError: () => {
      toast.error("Failed to add reward");
    },
  });

  return { ...mutation };
};
