import { ChallengeService } from "@/api/admin/challengeService";
import { HttpService } from "@/api/httpService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useRemoveChallenge = () => {
  const httpService = new HttpService();
  const challengeService = new ChallengeService(httpService);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (challengeId: string) =>
      challengeService.removeChallenge(challengeId),
    onSuccess: () => {
      toast.dismiss();
      toast.success("Success Removed challenge");
      queryClient.invalidateQueries({ queryKey: ["challenge"] });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message || "Failed to Remove  challenge");
    },
  });

  return { ...mutation };
};
