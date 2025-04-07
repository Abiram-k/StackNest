import mongoose from "mongoose";
import { IReport } from "../types/IReport";

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportedEntity: {
      type: mongoose.Schema.Types.ObjectId,
      required: function (this: any): boolean {
        return this.reportType !== "general";
      },
      refPath: "reportType",
    },
    reportType: {
      type: String,
      enum: ["user", "room", "feed", "general"],
      required: true,
    },
    reason: {
      type: String,
      required: true,
      maxlength: 200,
    },
    message: {
      type: String,
      maxlength: 1000,  
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "dismissed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },

    adminNote: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

export const ReportModel = mongoose.model<IReport>("Report", reportSchema);
