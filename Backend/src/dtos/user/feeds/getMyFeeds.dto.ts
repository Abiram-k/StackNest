export interface ResCommentType {
  userId: {
    userName: string;
    avatar: string;
  };
  comment: string;
  likes: number;
  replies?: ResCommentType[] | [];
}

export interface ResFeedType {
  userId: {
    userName: string;
    avatar: string;
  };
  title: string;
  content: string;
  media?: string;
  isBlocked: boolean;
  likes: number;
  // comments: ResCommentType[] | null;
  comments:number;
}

export interface ResGetMyFeedsDTO {
  message: string;
  success: boolean;
  myFeeds: ResFeedType[] | null;
}
