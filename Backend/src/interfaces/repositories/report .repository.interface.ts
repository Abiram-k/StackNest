import { Types } from "mongoose";

export interface IReportRepository<T> {
  createReport(data: {
    reporterId: Types.ObjectId;
    reportedEntity: string;
    reportType: "user" | "room" | "general";
    reason: string;
    message?: string;
  },priority:string): Promise<void>;
  getAllReports(): Promise<T[]>;
}
