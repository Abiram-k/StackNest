import { HttpService } from "@/api/httpService"
import { PremiumService } from "@/api/user/premiumService";
import { useQuery } from "@tanstack/react-query"

export const useGetPremiumHistory = () => {
    const httpService = new HttpService();
    const premiumService = new PremiumService(httpService);
    return useQuery({
        queryKey:["premium-history"],
        queryFn:()=>premiumService.getPremiumHistory()
    })
}