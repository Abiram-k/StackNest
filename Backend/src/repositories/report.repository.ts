import { Types } from "mongoose";
import { IReportRepository } from "../interfaces/repositories/report .repository.interface";
import { ReportModel } from "../models/reports.model";
import { IReport } from "../types/IReport";

enum SortOptions {
  "Latest" = "Latest",
  "Oldest" = "Oldest",
}
enum FiterOptions {
  "Resolved" = "Resolved",
  "Rejected" = "Rejected",
  "Pending" = "Pending",
  "HighPriority" = "HighPriority",
  "MediumPriority" = "MediumPriority",
  "LowPriority" = "LowPriority",
}

export class ReportRepository implements IReportRepository<IReport> {
  async getAllReports(
    filter: string,
    sort: string,
    page: number,
    limit: number
  ): Promise<{ reports: IReport[]; totalPages: number }> {
    try {
      const filterQuery: any = {};
      const sortQuery: any = {};

      if (filter == FiterOptions.HighPriority) {
        filterQuery.priority = "high";
        filterQuery.status = { $eq: "pending" };
      } else if (filter == FiterOptions.MediumPriority) {
        filterQuery.priority = "medium";
        filterQuery.status = { $eq: "pending" };
      } else if (filter == FiterOptions.LowPriority) {
        filterQuery.priority = "low";
        filterQuery.status = { $eq: "pending" };
      } else if (filter == FiterOptions.Pending) {
        filterQuery.status = "pending";
      } else if (filter == FiterOptions.Rejected) {
        filterQuery.status = "dismissed";
      } else if (filter == FiterOptions.Resolved) {
        filterQuery.status = "reviewed";
      }
      const skip = (page - 1) * limit;

      sortQuery.createdAt = sort === SortOptions.Oldest ? 1 : -1;

      const totalDocuments = await ReportModel.countDocuments(filterQuery);

      const totalPages = Math.ceil(totalDocuments / limit);

      const reports = await ReportModel.find(filterQuery)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .populate("reporterId");
      return { reports, totalPages };
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
        ...(priority && { priority }),
      };
      await ReportModel.create(reportData);
    } catch (error) {
      throw error;
    }
  }
  async resolveReport(reportId: string): Promise<IReport | null> {
    try {
      const report = await ReportModel.findByIdAndUpdate(
        reportId,
        { status: "reviewed" },
        { new: true }
      );
      return report;
    } catch (error) {
      throw error;
    }
  }
  async rejectReport(reportId: string): Promise<IReport | null> {
    try {
      const report = await ReportModel.findByIdAndUpdate(
        reportId,
        { status: "dismissed" },
        { new: true }
      );
      return report;
    } catch (error) {
      throw error;
    }
  }
}
