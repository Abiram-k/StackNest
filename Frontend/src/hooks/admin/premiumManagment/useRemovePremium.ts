import { PremiumPlanService } from "@/api/admin/premiumPlanService";
import { HttpService } from "@/api/httpService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRemovePremium = () => {
  const httpService = new HttpService();
  const premiumPlanService = new PremiumPlanService(httpService);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (premiumId: string) =>
      premiumPlanService.removePremium(premiumId),
    onSuccess: () => {
      toast.success("Plan removed");
      queryClient.invalidateQueries({ queryKey: ["premium-plans"] });
    },
    onError: () => {
      toast.error("Failed to remove Plan");
    },
  });

  return { ...mutation };
};
