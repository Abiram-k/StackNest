import { axiosResponse, RoomResType } from "@/types";
import { HttpService } from "../httpService";

type ResFavorites = axiosResponse & {
  rooms: RoomResType[];
};

export class FavoritesService {
  private readonly _httpService: HttpService;
  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }

  async fetchFavorites(): Promise<ResFavorites> {
    return this._httpService.get("/users/favorites");
  }

  async addToFavorites(roomId: string): Promise<axiosResponse> {
    return this._httpService.post("/users/favorites", { roomId });
  }

  async removeFromFavorites(roomId: string): Promise<axiosResponse> {
    return this._httpService.delete(`/users/favorites?roomId=${roomId}`);
  }
}
