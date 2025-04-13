type notificationType = {
  sender: {
    userName: string;
    avatar: string;
  };
  notificationId: string;
  sendedAt:Date
};

interface ResGetNotificationDTO {
  notifications: notificationType[];
}
