interface FriendsRes {
  friendId: string;
  firstName: string;
  userName: string;
  avtar: string;
  lastMessage: string;
  lastMessageAt: Date | null;
  unReadMessageCount: number;
}
interface ResGetFriendDTO {
  friends: FriendsRes[];
}
