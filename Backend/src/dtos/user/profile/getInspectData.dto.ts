export type inspectuserDataDTO = {
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
  message: string;
  success: boolean;
}
