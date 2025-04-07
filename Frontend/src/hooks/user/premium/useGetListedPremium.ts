import { HttpService } from "@/api/httpService";
import { PremiumService } from "@/api/user/premiumService";
import { useQuery } from "@tanstack/react-query";

export const useGetListedPremium = () => {
  const httpService = new HttpService();
  const premiumService = new PremiumService(httpService);
  return useQuery({
    queryKey: ["listed-plans"],
    queryFn: () => premiumService.getListedPremium(),
  });
};
