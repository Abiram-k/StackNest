import { Types } from "mongoose";

export interface IReportRepository<T> {
  createReport(
    data: {
      reporterId: Types.ObjectId;
      reportedEntity: string;
      reportType: "user" | "room" | "general";
      reason: string;
      message?: string;
    },
    priority: string
  ): Promise<void>;
  resolveReport(reportId: string): Promise<T | null>;
  rejectReport(reportId: string): Promise<T | null>;
  getAllReports(
    filter: string,
    sort: string,
    page: number,
    limit: number
  ): Promise<{ reports: T[]; totalPages: number }>;
}
