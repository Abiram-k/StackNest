import { axiosResponse } from "@/types";
import { HttpService } from "../httpService";
import { NOTIFICATION_ROUTES } from "@/constants/apiRoutes";

export class NotificationService {
  private _httpService: HttpService;
  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }

  async subscribeUser(subscription: any): Promise<axiosResponse> {
    const response = await this._httpService.post<axiosResponse>(
      NOTIFICATION_ROUTES.SUBSCRIBE_USER,
      {
        subscription,
      }
    );
    return response;
  }
}
