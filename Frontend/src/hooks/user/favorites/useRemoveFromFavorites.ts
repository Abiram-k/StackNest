import { HttpService } from "@/api/httpService";
import { FavoritesService } from "@/api/user/favoritesService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRemoveFromFavorites = () => {
  const httpService = new HttpService();
  const favoritesService = new FavoritesService(httpService);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (roomId: string) =>
      favoritesService.removeFromFavorites(roomId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.dismiss();
      toast.success("Room removed");
    },

    onError: (error) => {
      toast.dismiss();
      toast.error(error.message || "Failed to add favorites");
    },
  });

  return { ...mutation };
};
