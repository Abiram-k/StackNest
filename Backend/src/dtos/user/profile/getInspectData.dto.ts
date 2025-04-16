export type inspectuserDataDTO = {
  id:string;
  userName: string;
  avatar: string;
  description: string;
  connectionCount: number;
  feedsCount: number;
  streakCount: number;
};
export type inspectfeedDataDTO = {
  feedId: string;
  title: string;
  content: string;
  media?: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  uploadedAt: string;
};

export interface ResGetInspectDataDTO {
  userData: inspectuserDataDTO;
  feedData: inspectfeedDataDTO[];
  isAlreadyInConnection: boolean;
  message: string;
  success: boolean;
}
