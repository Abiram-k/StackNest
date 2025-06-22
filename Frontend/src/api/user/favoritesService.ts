import { axiosResponse, RoomResType } from "@/types";
import { HttpService } from "../httpService";
import { FAVORITE_ROUTES } from "@/constants/apiRoutes";

type ResFavorites = axiosResponse & {
  rooms: RoomResType[];
};

export class FavoritesService {
  private readonly _httpService: HttpService;
  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }

  async fetchFavorites(): Promise<ResFavorites> {
    return this._httpService.get(FAVORITE_ROUTES.FETCH_FAVORITES);
  }

  async addToFavorites(roomId: string): Promise<axiosResponse> {
    return this._httpService.post(FAVORITE_ROUTES.ADD_TO_FAVORITES, { roomId });
  }

  async removeFromFavorites(roomId: string): Promise<axiosResponse> {
    return this._httpService.delete(
      FAVORITE_ROUTES.REMOVE_FROM_FAVORITES(roomId)
    );
  }
}
