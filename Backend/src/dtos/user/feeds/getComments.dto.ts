export interface ResCommentDTO {
  id: string;
  userId: {
    userName: string;
    avatar: string;
    isVerified:boolean
  };
  text: string;
  replies: ResCommentDTO[];
  replyCount:number,
  createdAt: string;
}
