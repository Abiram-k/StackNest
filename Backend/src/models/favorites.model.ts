import mongoose, { Types } from "mongoose";
import { IFavorites } from "../types/IFavorites";

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: Types.ObjectId,
      ref: "Room",
      required: true,
    },
  },
  { timestamps: true }
);

export const Favorites = mongoose.model<IFavorites>("Favorites", favoriteSchema);
