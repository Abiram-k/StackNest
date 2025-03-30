import { ChallengeService } from "@/api/admin/challengeService";
import { HttpService } from "@/api/httpService";
import { challegeType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useUpdateChallenge = () => {
  const httpService = new HttpService();
  const challengeService = new ChallengeService(httpService);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: ({
      challengeId,
      data,
    }: {
      challengeId: string;
      data: challegeType;
    }) => challengeService.updateChallenge(challengeId, data),
    onSuccess: () => {
      toast.dismiss();
      toast.success("challenge updated");
      queryClient.invalidateQueries({ queryKey: ["challenge"] });
      navigate(-1);
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to update challenge");
    },
  });

  return { ...mutation };
};
