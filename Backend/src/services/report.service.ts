import { Types } from "mongoose";
import { IReportRepository } from "../interfaces/repositories/report .repository.interface";
import { IReportService } from "../interfaces/services/report.service.interface";
import { IReport } from "../types/IReport";
import creatHttpError from "http-errors";
import { HttpStatus } from "../constants/enum.statusCode";
import { IRoomRepository } from "../interfaces/repositories/room.repository.interface";
import { IRoom } from "../types/IRoom";
import { IUserBaseRepository } from "../interfaces/repositories/user.repository.interface";
import { IUser } from "../types/IUser";
import { ResReportDTO } from "../dtos/admin/reportManagement/getReport.dto";
import { reportDismissedMail, reportResolvedMail } from "../utils/email";

export class ReportService implements IReportService {
  private _reportRepo: IReportRepository<IReport>;
  private _roomRepo: IRoomRepository<IRoom>;
  private _userRepo: IUserBaseRepository<IUser>;
  constructor(
    reportRepo: IReportRepository<IReport>,
    roomRepo: IRoomRepository<IRoom>,
    userRepo: IUserBaseRepository<IUser>
  ) {
    this._reportRepo = reportRepo;
    this._roomRepo = roomRepo;
    this._userRepo = userRepo;
  }

  async report(data: {
    reporterId: Types.ObjectId;
    reportedEntity: string;
    reportType: "user" | "room" | "general";
    reason: string;
    message?: string;
  }): Promise<void> {
    try {
      if (!data.reporterId)
        throw creatHttpError(HttpStatus.NOT_FOUND, "Reporter Id not founded");
      if (!data.reportedEntity)
        throw creatHttpError(
          HttpStatus.NOT_FOUND,
          "Reported entity Id not founded"
        );
      if (!data.reportType)
        throw creatHttpError(HttpStatus.NOT_FOUND, "Report type not founded");
      if (!data.reason)
        throw creatHttpError(
          HttpStatus.NOT_FOUND,
          "Reported reason not founded"
        );
      if (data.reportType == "room") {
        const room = await this._roomRepo.findByRoomId(data.reportedEntity);
        data.reportedEntity = room?._id || data.reportedEntity;
      }
      const reporter = await this._userRepo.findById(String(data.reporterId));
      const isPremiumUser =
        reporter?.rewards.some(
          (reward) => reward.benefitKey == "fast_customer_support"
        ) || reporter?.isVerified;
      let priority = "";
      if (isPremiumUser) priority = "high";
      await this._reportRepo.createReport(data, priority);
    } catch (error) {
      throw error;
    }
  }

  async resolveReport(reportId: string): Promise<void> {
    try {
      if (!reportId)
        throw creatHttpError(HttpStatus.NOT_FOUND, "Report id not founded");
      const report = await this._reportRepo.resolveReport(reportId);
      if (!report)
        throw creatHttpError(HttpStatus.FORBIDDEN, "Failed to resolve report");
      const reporter = await this._userRepo.findById(String(report.reporterId));
      await reportResolvedMail(reporter?.email);
    } catch (error) {
      throw error;
    }
  }
  async rejectReport(reportId: string): Promise<void> {
    try {
      if (!reportId)
        throw creatHttpError(HttpStatus.NOT_FOUND, "Report id not founded");
      const report = await this._reportRepo.rejectReport(reportId);
      if (!report)
        throw creatHttpError(HttpStatus.FORBIDDEN, "Failed to resolve report");
      const reporter = await this._userRepo.findById(String(report.reporterId));
      await reportDismissedMail(reporter?.email);
    } catch (error) {
      throw error;
    }
  }

  async getAllReports(
    filter: string,
    sort: string,
    page: number,
    limit: number
  ): Promise<{ reports: ResReportDTO[]; totalPages: number }> {
    try {
      const { reports, totalPages } = await this._reportRepo.getAllReports(
        filter,
        sort,
        page,
        limit
      );
      const formattedReports = reports
        .map((report) => {
          if (!report || !report.reporterId) return undefined;

          if (report.reporterId instanceof Types.ObjectId) {
            console.log("Reporter id is not populated");
            return undefined;
          }

          const reportedUser = report.reporterId as {
            userName: string;
            avatar: string;
          };

          return {
            _id: report._id,
            message: report.message,
            priority: report.priority,
            reason: report.reason,
            reportedAt: report.createdAt,
            reportedEntityId: report.reportedEntity,
            type: report.reportType,
            createdAt: String(report.createdAt),
            status: report.status,
            userAvatar: reportedUser.avatar,
            userName: reportedUser.userName,
          };
        })
        .filter((r): r is ResReportDTO => r !== undefined);

      return { reports: formattedReports, totalPages };
    } catch (error) {
      throw error;
    }
  }
}
