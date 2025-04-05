import { PremiumPlanService } from "@/api/admin/premiumPlanService";
import { HttpService } from "@/api/httpService";
import { ReqPremium } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useCreatePremiumPlan = () => {
  const httpService = new HttpService();
  const premiumPlanService = new PremiumPlanService(httpService);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (data: ReqPremium) => premiumPlanService.addPremium(data),
    onSuccess: () => {
      toast.success("New plan created");
      navigate(-1);
      queryClient.invalidateQueries({ queryKey: ["premium-plan"] });
    },
    onError: () => {
      toast.error("Failed to create new plan");
    },
  });
  return { ...mutation };
};
