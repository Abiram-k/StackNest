import mongoose, { Model, Schema } from "mongoose";
import { IComment } from "../types/IFeed";

const CommentSchema = new Schema(
  {
    feedId: {
      type: Schema.Types.ObjectId,
      ref: "Feed",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IComment>("Comment", CommentSchema);
