import { Types } from "mongoose";

export interface IReport {
  reporterId: Types.ObjectId;
  reportedEntity: Types.ObjectId;
  reportType: "user" | "room" | "feed" | "general";
  reason: string;
  message: string;
  status: "pending" | "resolved" | "dismissed";
  priority: "high" | "medium" | "low";
  adminNote: string;
  createdAt: Date;
  updatedAt: Date;
}
