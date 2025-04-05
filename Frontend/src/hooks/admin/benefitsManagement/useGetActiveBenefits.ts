import { HttpService } from "@/api/httpService";
import { BenefitsService } from "@/api/public/benefitsService";
import { useQuery } from "@tanstack/react-query";

export const useGetActiveBenefits = () => {
  const httpService = new HttpService();
  const benefitsService = new BenefitsService(httpService);
  return useQuery({
    queryKey: ["active_benefits"],
    queryFn: () => benefitsService.getActiveBenefits(),
  });
};
