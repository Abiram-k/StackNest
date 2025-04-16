import { axiosResponse } from "@/types";
import { HttpService } from "../httpService";

interface MsgUser {
  _id: string;
  name: string;
  avatar: string;
}
type GetMessageRes = axiosResponse & {
  friendData: MsgUser;
  userData: MsgUser;
  messages: {
    id: string;
    senderId: string;
    message: string;
    type: "text" | "image" | "video";
    isRead: boolean;
  }[];
};
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
    sendedAt: Date;
  }[];
};
type GetFriendsType = axiosResponse & {
  friends: {
    friendId: string;
    firstName: string;
    userName: string;
    avtar: string;
    lastMessage: string;
    lastMessageAt: Date;
    unReadMessageCount: number;
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
  async rejectRequest(requestId: string): Promise<axiosResponse> {
    return await this._httpService.post("/users/connection/reject", {
      requestId,
    });
  }
  async acceptRequest(requestId: string): Promise<axiosResponse> {
    return await this._httpService.post("/users/connection/accept", {
      requestId,
    });
  }
  async unfollow(freindUserName: string): Promise<axiosResponse> {
    return await this._httpService.post("/users/connection/unfollow", {
      freindUserName,
    });
  }

  async getAllConnections(search: string): Promise<GetFriendsType> {
    return await this._httpService.get(
      `/users/connection/all?search=${search}`
    );
  }

  async sendMessage(friendId: string, content: string): Promise<axiosResponse> {
    return await this._httpService.post(
      `/users/connection/message?friendId=${friendId}`,
      { content }
    );
  }
  async getMessages(friendId: string): Promise<GetMessageRes> {
    return await this._httpService.get(
      `/users/connection/message?friendId=${friendId}`
    );
  }

  async toggleIsRead(messageId: string): Promise<axiosResponse> {
    return await this._httpService.patch(
      `/users/connection/message/read/${messageId}`
    );
  }

  async getUnreadMessageCount(): Promise<axiosResponse & { count: number }> {
    return await this._httpService.get(
      `/users/connection/message/unread/count`
    );
  }
}
