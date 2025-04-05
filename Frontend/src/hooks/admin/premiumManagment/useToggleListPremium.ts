import { PremiumPlanService } from "@/api/admin/premiumPlanService";
import { HttpService } from "@/api/httpService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useToggleListPremium =()=> {
    const httpService = new HttpService();
    const premiumPlanService = new PremiumPlanService(httpService);
    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationFn: (premiumId: string) => premiumPlanService.toggleListPremium(premiumId),
      onSuccess: () => {
        toast.success("Action done");
        queryClient.invalidateQueries({ queryKey: ["premium-plans"] });
      },
      onError: () => {
        toast.error("Action undone");
      },
    });
  
    return { ...mutation };
}