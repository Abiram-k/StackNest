export type notificationType = {
  sender: {
    userName: string;
    avatar: string;
  };
  notificationId: string;
  sendedAt:Date
};

export interface ResGetNotificationDTO {
  notifications: notificationType[];
}
