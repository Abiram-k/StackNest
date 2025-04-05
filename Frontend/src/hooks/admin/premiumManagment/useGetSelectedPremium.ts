import { PremiumPlanService } from "@/api/admin/premiumPlanService";
import { HttpService } from "@/api/httpService";
import { useQuery } from "@tanstack/react-query";

export const useGetSelectedPremium = (premiumId: string) => {
  const httpService = new HttpService();
  const premiumPlanService = new PremiumPlanService(httpService);
  return useQuery({
    queryKey: ["premium"],
    queryFn: () => premiumPlanService.getSelectedPremium(premiumId),
  });
};
