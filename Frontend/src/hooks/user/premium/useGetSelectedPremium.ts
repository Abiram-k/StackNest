import { HttpService } from "@/api/httpService";
import { PremiumService } from "@/api/user/premiumService";
import { useQuery } from "@tanstack/react-query";

export const useGetSelectedPremium = (planId: string) => {
  const httpService = new HttpService();
  const premiumService = new PremiumService(httpService);
  return useQuery({
    queryKey: ["selected-plans"],
    queryFn: () => premiumService.getSelectedPremium(planId),
  });
};
