import { PremiumPlanService } from "@/api/admin/premiumPlanService";
import { HttpService } from "@/api/httpService";
import { useQuery } from "@tanstack/react-query";

export const useGetAllPremium = () => {
  const httpService = new HttpService();
  const premiumPlanservice = new PremiumPlanService(httpService);
  return useQuery({
    queryKey: ["premium-plans"],
    queryFn: () => premiumPlanservice.getAllPremium(),
  });
};
