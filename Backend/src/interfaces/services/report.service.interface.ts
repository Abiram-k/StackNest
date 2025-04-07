import { Types } from "mongoose";

export interface IReportService {
    report(data: {
        reporterId: Types.ObjectId;
        reportedEntity: string;
        reportType: "user" | "room" | "general";
        reason: string;
        message?: string;
      }):Promise<void>;

}