import { IsNumber, IsString } from "class-validator";

export class AddOrUpdateRewardDTO {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsNumber()
  points_cost: number;
  @IsString()
  benefit_key:
    | "extra_profile_edit"
    | "profile_image_edit"
    | "premium_room_creation"
    | "3d_premium_access"
    | "fast_customer_support"
    | "add_room_favorites"
    | "chat_bot_access";
}
