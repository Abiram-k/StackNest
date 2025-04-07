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
      const isPremiumUser = reporter?.rewards.some(
        (reward) => reward.benefitKey == "fast_customer_support"
      );
      let priority = "";
      if (isPremiumUser) priority = "high";
      await this._reportRepo.createReport(data,priority);
    } catch (error) {
      throw error;
    }
  }
}
