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
  feedId:string,
  userId: {
    userName: string;
    avatar: string;
  };
  title: string;
  uploadedAt: string;
  content: string;
  media?: string;
  isBlocked: boolean;
  viewsCount:number;
  likes: number;
  // comments: ResCommentType[] | null;
  comments: number;
}

export interface ResGetMyFeedsDTO {
  message: string;
  success: boolean;
  myFeeds: ResFeedType[] | null;
}
