import { BannerService } from "@/api/admin/bannerServices";
import { HttpService } from "@/api/httpService";
import { BannerReq, BannerRes } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAddBanner = () => {
  const httpService = new HttpService();
  const bannerService = new BannerService(httpService);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: BannerReq) => bannerService.addBanner(data),
    onSuccess: () => {
      toast.dismiss();
      toast.success("Success added new banner");
      queryClient.invalidateQueries({ queryKey: ["banner"] });
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to added new banner");
    },
  });

  return { ...mutation };
};
