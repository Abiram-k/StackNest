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
      // | "extra_profile_edit"
      // | "one_premium_room_creation"
      // | "temporary_premium_access"
      // | "fast_customer_support";
  
    createdAt?: Date;
    updatedAt?: Date;
  }
  