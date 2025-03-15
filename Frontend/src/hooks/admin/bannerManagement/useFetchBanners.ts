import { BannerService } from "@/api/admin/bannerServices";
import { HttpService } from "@/api/httpService";
import { useQuery } from "@tanstack/react-query";

export const useFetchBanners = () => {
  const httpService = new HttpService();
  const bannerService = new BannerService(httpService);

  const mutation = useQuery({
    queryKey: ["banner"],
    queryFn: () => bannerService.fetchBanners(),
  });

  return mutation;
};
