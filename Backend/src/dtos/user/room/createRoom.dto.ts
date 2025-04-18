import { Type } from "class-transformer";
import {
  IsString,
  MinLength,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsDate,
} from "class-validator";

export class CreateRoomDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  limit: number;

  @IsString()
  isPremium: string;

  @IsString()
  isPrivate: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  scheduledAt?: Date;
}

export interface ResCreateRoomDTO {
  message: string;
  success: boolean;
}
