import { ChallengeService } from "@/api/admin/challengeService";
import { HttpService } from "@/api/httpService";
import { challegeType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useAddChallenge = () => {
  const httpService = new HttpService();
  const challengeService = new ChallengeService(httpService);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: challegeType) => challengeService.addNewChallenge(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["challenge"] });
      toast.dismiss();
      toast.success(data.message || "Challenge added");
      navigate(-1);
    },
    onError: (error) => {
      console.log(error);
      toast.dismiss();
      toast.error(error.message || "Failed to add new Challege");
    },
  }); 

  return { ...mutation };
};

export default useAddChallenge;
