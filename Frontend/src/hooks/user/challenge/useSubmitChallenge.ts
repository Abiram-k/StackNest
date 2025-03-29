import { HttpService } from "@/api/httpService";
import { UserChallengeService } from "@/api/user/userChallengeService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useSubmitChallenge = () => {
  const httpService = new HttpService();
  const userChallengeService = new UserChallengeService(httpService);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: ({
      challengeId,
      answer,
    }: {
      challengeId: string;
      answer: string;
    }) => userChallengeService.submitChallenge(challengeId, answer),
    onSuccess: (data) => {
      toast.dismiss();
      if (data.success) {
        // toast.success("Answer is correct");
      } else {
        toast.error("Answer is incorrect");
      }
      queryClient.invalidateQueries({ queryKey: ["challengePoints"] });
      queryClient.invalidateQueries({ queryKey: ["submitted_challenges"] });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message || "Failed to update challenge");
    },
  });

  return { ...mutation };
};
