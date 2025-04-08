import { Types } from "mongoose";

export interface ResReportDTO {
  _id: string;
  userName: string;
  reportedAt: Date;
  userAvatar: string;
  type: "user" | "room" | "general" | "feed";
  status: "pending" | "resolved" | "dismissed";
  reportedEntityId: Types.ObjectId;
  createdAt: string;
  reason: string;
  message: string;
  priority: "high" | "medium" | "low";
}
