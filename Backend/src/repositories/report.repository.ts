import { Types } from "mongoose";
import { IReportRepository } from "../interfaces/repositories/report .repository.interface";
import { ReportModel } from "../models/reports.model";
import { IReport } from "../types/IReport";

export class ReportRepository implements IReportRepository<IReport> {
  async getAllReports(): Promise<IReport[]> {
    try {
      return await ReportModel.find();
    } catch (error) {
      throw error;
    }
  }
  async createReport(
    data: {
      reporterId: Types.ObjectId;
      reportedEntity: string;
      reportType: "user" | "room" | "general";
      reason: string;
      message?: string;
    },
    priority: string
  ): Promise<void> {
    try {
      const reportData = {
        ...data,
        ...(priority && { priority }) 
      };
      await ReportModel.create(reportData);
    } catch (error) {
      throw error;
    }
  }
}
