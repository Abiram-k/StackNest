import { HttpService } from "@/api/httpService";
import { BenefitsService } from "@/api/public/benefitsService";
import { useQuery } from "@tanstack/react-query";

export const useGetSelectedBenefits = (benefitId: string) => {
  const httpService = new HttpService();
  const benefitsService = new BenefitsService(httpService);
  return useQuery({
    queryKey: ["benefits"],
    queryFn: () => benefitsService.getSelectedBenefits(benefitId),
  });
};
