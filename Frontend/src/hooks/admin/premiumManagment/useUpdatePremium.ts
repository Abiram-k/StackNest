import { PremiumPlanService } from "@/api/admin/premiumPlanService";
import { HttpService } from "@/api/httpService";
import { ReqPremium } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useUpdatePremium = () => {
  const httpService = new HttpService();
  const premiumPlanService = new PremiumPlanService(httpService);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: ({
      premiumId,
      data,
    }: {
      premiumId: string;
      data: ReqPremium;
    }) => premiumPlanService.updatePremium(premiumId, data),
    onSuccess: () => {
      toast.success("Plan updated");
      queryClient.invalidateQueries({ queryKey: ["premium-plans"] });
      navigate(-1);
    },
    onError: () => {
      toast.error("Failed to updated plan");
    },
  });

  return { ...mutation };
};
