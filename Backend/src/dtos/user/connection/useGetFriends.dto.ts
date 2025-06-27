export interface FriendsRes {
  friendId: string;
  firstName: string;
  userName: string;
  avtar: string;
  lastMessage: string;
  lastMessageAt: Date | null;
  unReadMessageCount: number;
  isVerified:boolean,

}
export interface ResGetFriendDTO {
  friends: FriendsRes[];
}
