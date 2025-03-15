import { BannerService } from "@/api/admin/bannerServices";
import { HttpService } from "@/api/httpService";
import { BannerRes } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateBanner = () => {
  const httpService = new HttpService();
  const bannerService = new BannerService(httpService);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ bannerId, data }: { bannerId: string; data: BannerRes }) =>
      bannerService.updateBanner(data, bannerId),
    onSuccess: () => {
      toast.dismiss();
      toast.success("Success added new banner");
      queryClient.invalidateQueries({ queryKey: ["banner"] });
    },
    onError: () => {
      toast.dismiss();
      toast.success("Failed to added new banner");
    },
  });

  return { ...mutation };
};
