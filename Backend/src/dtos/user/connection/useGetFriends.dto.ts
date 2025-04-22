interface FriendsRes {
  friendId: string;
  firstName: string;
  userName: string;
  avtar: string;
  lastMessage: string;
  lastMessageAt: Date | null;
  unReadMessageCount: number;
  isVerified:boolean,

}
interface ResGetFriendDTO {
  friends: FriendsRes[];
}
