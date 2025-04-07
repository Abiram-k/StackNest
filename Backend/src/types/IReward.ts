import { Types } from "mongoose";

export interface IReward {
    _id: string;
    name: string;
    description: string;
    points_cost: number;
    type: "authorization" | "discount" | "bonus" | "feature" | "custom";
    isActive: boolean;
    benefit_key:
      | "extra_profile_edit"
      | "one_premium_room_creation"
      | "temporary_premium_access"
      | "fast_customer_support";
  
    createdAt?: Date;
    updatedAt?: Date;
  }
  