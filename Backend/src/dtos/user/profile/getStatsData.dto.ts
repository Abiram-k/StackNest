export interface IStatsUser {
  streakCount: number;
  points: number;
}

interface IUserTableData {
  userName: string;
  avatar: string;
  count: number;
}

export type IStreakTableData = IUserTableData[];

export type IPointsTableData = IUserTableData[];

export interface IResgetStatsDataDTO {
  message: string;
  success: true;
  user: IStatsUser;
  streakTableData: IStreakTableData;
  pointsTableData: IPointsTableData;
}
