import { HttpService } from "@/api/httpService";
import { UserBannerService } from "@/api/user/userBannerService";
import { useQuery } from "@tanstack/react-query";

export const useFetchUserBanners = () => {
  const httpService = new HttpService();
  const userBannerService = new UserBannerService(httpService);
  return useQuery({
    queryKey: ["banner"],
    queryFn: () => userBannerService.fetchUserBanners(),
  });
};
