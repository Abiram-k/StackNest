import mongoose from "mongoose";
import { ICallLog } from "../types/ICallLog.js";

const CallLogSchema = new mongoose.Schema(
  {
    initiator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reciever: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "rejected", "missed"],
    },
    // duration: {
    //   type: Number,
    //   default: 0,
    // },
  },
  { timestamps: true }
);

export const CallLog = mongoose.model<ICallLog>("CallLog", CallLogSchema);
