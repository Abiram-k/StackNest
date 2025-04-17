export interface ICallRepository<T> {
  createCallLog(data: {
    initiator: string;
    reciever: string;
    status: "completed" | "rejected" | "missed";
  }): Promise<void>;
  findOneAndUpdateStatus(
    initiator: string,
    reciever: string,
    status: "completed" | "rejected" | "missed"
  ): Promise<void>;
  getCallLogs(userId: string): Promise<T[]>;
}
