import { BannerService } from "@/api/admin/bannerServices";
import { HttpService } from "@/api/httpService";
import { BannerReq } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateBanner = () => {
  const httpService = new HttpService();
  const bannerService = new BannerService(httpService);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ bannerId, data }: { bannerId: string; data: BannerReq }) =>
      bannerService.updateBanner(data, bannerId),
    onSuccess: () => {
      toast.dismiss();
      toast.success("banner updated");
      queryClient.invalidateQueries({ queryKey: ["banner"] });
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to update challenge");
    },
  });

  return { ...mutation };
};
