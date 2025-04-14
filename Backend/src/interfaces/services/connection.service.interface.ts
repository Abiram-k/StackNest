export interface IConnectionService {
  sendConnectionRequest(
    senderId: string,
    recieverUserName: string
  ): Promise<void>;
  getConnectionRequests(userId: string): Promise<string[]>;
  unfollow(userId: string, freindUserName: string): Promise<void>;
  rejectRequest(requestId: string): Promise<void>;
  acceptRequest(requestId: string): Promise<void>;
  getNotifications(userId: string): Promise<ResGetNotificationDTO>;
}
