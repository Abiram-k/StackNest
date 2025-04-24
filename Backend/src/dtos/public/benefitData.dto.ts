export interface BenefitResDto {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export type RewardBenefitsT =
  | "extra_profile_edit"
  | "profile_image_edit"
  | "premium_room_creation"
  | "3d_premium_access"
  | "fast_customer_support"
  | "add_room_favorites"
  | "chat_bot_access";
