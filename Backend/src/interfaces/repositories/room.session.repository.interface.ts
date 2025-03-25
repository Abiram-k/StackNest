export interface IRoomSessionRepository<T> {
  createSession(sessionData: {
    userId: string;
    roomId: string;
    startTime: Date;
  }): Promise<void>;
  getAllSession(): Promise<T[] | null>;
  getLatestSession(userId: string, startedTime: Date): Promise<T | null>;
  updateRoomSessionDuration(
    roomId: string,
    userId: string,
    duration: number,
    userLastJoined: Date
  ): Promise<boolean>;

  getSelectedSession(
    roomId: string,
    data: { sort: string; search: string; page: number; limit: number }
  ): Promise<{ totalPages: number; session: T[] }>;
}
