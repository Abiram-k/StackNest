export interface ResCommentDTO {
  id: string;
  userId: {
    userName: string;
    avatar: string;
  };
  text: string;
  replies: ResCommentDTO[];
  replyCount:number,
  createdAt: string;
}
