import { Document } from "mongoose";

export interface IBanner extends Document {
  _id: string;
  title: string;
  description: string;
  image: string;
}
