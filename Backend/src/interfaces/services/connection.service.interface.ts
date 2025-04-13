export interface IConnectionService {
  sendConnectionRequest(
    senderId: string,
    recieverUserName: string
  ): Promise<void>;
  getConnectionRequests(userId: string): Promise<string[]>;
  getNotifications(userId: string): Promise<ResGetNotificationDTO>;
}
