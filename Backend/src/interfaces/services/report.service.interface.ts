import { Types } from "mongoose";
import { ResReportDTO } from "../../dtos/admin/reportManagement/getReport.dto.js";

export interface IReportService {
  report(data: {
    reporterId: Types.ObjectId;
    reportedEntity: string;
    reportType: "user" | "room" | "general";
    reason: string;
    message?: string;
  }): Promise<void>;
  resolveReport(reportId:string):Promise<void>
  rejectReport(reportId: string): Promise<void>
  getAllReports(
    filter: string,
    sort: string,
    page: number,
    limit: number
  ): Promise<{ reports: ResReportDTO[]; totalPages: number }>;
}
