import { HttpService } from "@/api/httpService";
import { BenefitsService } from "@/api/public/benefitsService";
import { useQuery } from "@tanstack/react-query";

export const useGetAllBenefit = ({ currentPage }: { currentPage: number }) => {
  const httpService = new HttpService();
  const benefitsService = new BenefitsService(httpService);
  return useQuery({
    queryKey: ["benefits", currentPage],
    queryFn: () => benefitsService.getAllBenefits(currentPage, 10),
  });
};
