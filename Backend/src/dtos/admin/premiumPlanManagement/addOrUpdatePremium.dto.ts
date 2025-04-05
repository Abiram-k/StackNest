import { IsArray, IsNumber, IsString } from "class-validator";

export class AddOrUpdatePremiumDTO {
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsNumber()
  regularAmount: number;
  @IsNumber()
  discountAmount: number;
  @IsArray()
  @IsString({ each: true })
  benefits: string[];
}
