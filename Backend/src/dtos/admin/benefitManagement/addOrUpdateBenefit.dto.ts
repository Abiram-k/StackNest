import {  IsString } from "class-validator";

export class AddOrUpdateBenefitDTO {
  @IsString()
  name: string;
  @IsString()
  description: string;
}
