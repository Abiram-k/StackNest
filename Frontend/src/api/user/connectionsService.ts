import { axiosResponse } from "@/types";
import { HttpService } from "../httpService";
import { CONNECTION_ROUTES } from "@/constants/apiRoutes";

interface MsgUser {
  _id: string;
  name: string;
  avatar: string;
  userName: string;
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
    reactions: { userId: string; emoji: string }[];
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
    isVerified: boolean;
    avtar: string;
    lastMessage: string;
    lastMessageAt: Date;
    unReadMessageCount: number;
  }[];
};

type GetCallLogsRes = axiosResponse & {
  callLogs: {
    firstName: string;
    userName: string;
    avatar: string;
    status: "completed" | "rejected" | "missed";
    isMeInitiated: boolean;
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
    return await this._httpService.post(
      CONNECTION_ROUTES.SEND_CONNECTION_REQUEST,
      {
        recieverUserName,
      }
    );
  }
  async getConnectionRequest(): Promise<getConnectionRequestRes> {
    return await this._httpService.get(
      CONNECTION_ROUTES.GET_CONNECTION_REQUEST
    );
  }
  async getNotifactions(): Promise<getNoficationRes> {
    return await this._httpService.get(CONNECTION_ROUTES.GET_NOTIFICATIONS);
  }
  async rejectRequest(requestId: string): Promise<axiosResponse> {
    return await this._httpService.post(CONNECTION_ROUTES.REJECT_REQUEST, {
      requestId,
    });
  }
  async acceptRequest(requestId: string): Promise<axiosResponse> {
    return await this._httpService.post(CONNECTION_ROUTES.ACCEPT_REQUEST, {
      requestId,
    });
  }
  async unfollow(freindUserName: string): Promise<axiosResponse> {
    return await this._httpService.post(CONNECTION_ROUTES.UNFOLLOW, {
      freindUserName,
    });
  }

  async getAllConnections(search: string): Promise<GetFriendsType> {
    return await this._httpService.get(
      CONNECTION_ROUTES.GET_ALL_CONNECTIONS(search)
    );
  }

  async sendMessage(friendId: string, content: string): Promise<axiosResponse> {
    return await this._httpService.post(
      CONNECTION_ROUTES.SEND_MESSAGE(friendId),
      { content }
    );
  }
  async getMessages(friendId: string): Promise<GetMessageRes> {
    return await this._httpService.get(
      CONNECTION_ROUTES.GET_MESSAGES(friendId)
    );
  }
  async fetchCallLogs(): Promise<GetCallLogsRes> {
    return await this._httpService.get(CONNECTION_ROUTES.FETCH_CALL_LOGS);
  }

  async toggleIsRead(messageId: string): Promise<axiosResponse> {
    return await this._httpService.patch(
      CONNECTION_ROUTES.TOGGLE_IS_READ(messageId)
    );
  }

  async getUnreadMessageCount(): Promise<axiosResponse & { count: number }> {
    return await this._httpService.get(CONNECTION_ROUTES.UNREAD_MESSAGE_COUNT);
  }

  async deleteMessage(
    messageId: string
  ): Promise<axiosResponse & { deletedMessageId: string; friendId: string }> {
    return await this._httpService.delete(
      CONNECTION_ROUTES.DELETE_MESSAGE(messageId)
    );
  }
}
