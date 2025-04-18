interface User {
  _id: string;
  name: string;
  avatar: string;
  userName: string;
}
export interface GetMessageDTO {
  friendData: User;
  userData: User;
  messages: {
    message: string;
    type: "text" | "image" | "video";
    id: string;
    senderId: string;
    isRead: boolean;
    reactions: { userId: string; emoji: string }[];
  }[];
}
