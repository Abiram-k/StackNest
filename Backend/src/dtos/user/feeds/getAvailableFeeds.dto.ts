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
    likes: number;
    comments: number;
  }
  
  export interface ResGetAvailableFeedsDTO {
    message: string;
    success: boolean;
    myFeeds: ResFeedType[] | null;
  }
  