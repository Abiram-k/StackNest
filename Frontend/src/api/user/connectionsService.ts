import { axiosResponse } from "@/types";
import { HttpService } from "../httpService";

type getConnectionRequestRes = axiosResponse & {
  requests: string[];
};
type getNoficationRes = axiosResponse & {
  notifications: {
    sender: {
      userName: string;
      avatar: string;
    };
    notificationId: string;
    sendedAt:Date
  }[];
};
export class ConnectionsService {
  private readonly _httpService: HttpService;
  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }
  async sendConnectionRequest(
    recieverUserName: string
  ): Promise<axiosResponse> {
    return await this._httpService.post("/users/connection/request", {
      recieverUserName,
    });
  }
  async getConnectionRequest(): Promise<getConnectionRequestRes> {
    return await this._httpService.get("/users/connection/request");
  }
  async getNotifactions(): Promise<getNoficationRes> {
    return await this._httpService.get("/users/notifications");
  }
}
