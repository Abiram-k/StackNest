import { axiosResponse } from "@/types";
import { HttpService } from "../httpService";

export class NotificationService {
  private _httpService: HttpService;
  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }

  async subscribeUser(subscription: any): Promise<axiosResponse> {
    const response = await this._httpService.post<axiosResponse>(
      "/users/subscribe",
      {
        subscription,
      }
    );
    return response;
  }
}
