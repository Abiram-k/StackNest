import { PremiumPlanService } from "@/api/admin/premiumPlanService";
import { HttpService } from "@/api/httpService";
import { useQuery } from "@tanstack/react-query";

export const useGetAllPremium = ({ currentPage }: { currentPage: number }) => {
  const httpService = new HttpService();
  const premiumPlanservice = new PremiumPlanService(httpService);
  return useQuery({
    queryKey: ["premium-plans", currentPage],
    queryFn: () => premiumPlanservice.getAllPremium(currentPage),
  });
};
