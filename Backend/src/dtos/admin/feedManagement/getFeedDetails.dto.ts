interface IUserDTO {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface ICommentDTO {
  _id: string;
  content: string;
  user: IUserDTO;
  createdAt: string;
}
export interface IFeedDetailsDTO {
  _id: string;
  userId: IUserDTO & { isBlocked: boolean };
  title: string;
  content: string;
  scheduledAt: string | null;
  isPublished: boolean;
  media: string | null;
  isBlocked: boolean;
  viewsCount: number;
  views: string[];
  likes: string[];
  comments: ICommentDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface GetAdminFeedDetailsDTO {
  message: string;
  success: boolean;
  feedDetails: IFeedDetailsDTO | null;
}
