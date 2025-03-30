import { BannerService } from "@/api/admin/bannerServices";
import { HttpService } from "@/api/httpService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRemoveBanner = () => {
  const httpService = new HttpService();
  const bannerService = new BannerService(httpService);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (bannerId: string) => bannerService.removeBanner(bannerId),
    onSuccess: () => {
      toast.dismiss();
      toast.success("Success Removed banner");
      queryClient.invalidateQueries({ queryKey: ["banner"] });
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to Remove  banner");
    },
  });

  return { ...mutation };
};
