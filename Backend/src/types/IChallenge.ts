import { Document } from "mongoose";

export interface IChallenge extends Document {
  _id: string;
  questionNo: number;
  question: string;
  options: string[];
  answer: string;
  isListed: boolean;
}
