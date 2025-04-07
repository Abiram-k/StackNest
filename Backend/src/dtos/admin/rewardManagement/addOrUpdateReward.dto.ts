import { IsNumber, IsString } from "class-validator";

export class AddOrUpdateRewardDTO {
    @IsString()
    name:string;
    @IsString()
    description:string;
    @IsNumber()
    points_cost:number;
    @IsString()
    benefit_key:"extra_profile_edit" | "one_premium_room_creation" | "temporary_premium_access" | "fast_customer_support" ;
}