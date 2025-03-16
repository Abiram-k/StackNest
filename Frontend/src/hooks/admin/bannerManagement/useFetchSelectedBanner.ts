import { BannerService } from "@/api/admin/bannerServices";
import { HttpService } from "@/api/httpService";
import { useQuery } from "@tanstack/react-query";

export const useFetchSelectedBanner = (banner:string) => {
  const httpService = new HttpService();
  const bannerService = new BannerService(httpService);

  const mutation = useQuery({
    queryKey: ["banner"],
    queryFn: () => bannerService.fetchSelectedBanner(banner),
  });

  return mutation;
};
