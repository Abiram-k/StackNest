export interface GetUserCardData {
  userName: string;
  description: string;
  avatarUrl: string;
  friendsCount: number;
  feedsCount: number;
}

export interface ResGetUserCardData {
    message:string;
    success:boolean;
    data:GetUserCardData
}