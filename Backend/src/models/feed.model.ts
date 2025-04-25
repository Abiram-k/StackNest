import mongoose, { Schema } from "mongoose";
import { IFeed } from "../types/IFeed.js";

const FeedSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    isPublished:{
      type:Boolean,
      default:true
    },
    media: {
      type: String,
      default: null,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    viewsCount:{
      type:Number,
      default:0
    },
    views: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IFeed>("Feed", FeedSchema);
