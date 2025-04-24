import { Types } from "mongoose";
import { RewardBenefitsT } from "../dtos/public/benefitData.dto";

export interface IReward {
    _id: string;
    name: string;
    description: string;
    points_cost: number;
    type: "authorization" | "discount" | "bonus" | "feature" | "custom";
    isActive: boolean;
    benefit_key:RewardBenefitsT;
      
    createdAt?: Date;
    updatedAt?: Date;
  }
  