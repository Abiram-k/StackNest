import { HttpService } from "@/api/httpService";
import { FavoritesService } from "@/api/user/favoritesService";
import { useQuery } from "@tanstack/react-query";

export const useFetchFavorites = () => {
  const httpService = new HttpService();
  const favoritesService = new FavoritesService(httpService);
  return useQuery({
    queryKey: ["favorites"],
    queryFn: () => favoritesService.fetchFavorites(),
  });
};
