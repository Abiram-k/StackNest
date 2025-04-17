export interface FetchCallLogsDTO {
  firstName: string;
  userName: string;
  avatar: string;
  status: "completed" | "rejected" | "missed";
  isMeInitiated: boolean;
}
