import { IsDate, IsDateString, IsOptional, IsString } from "class-validator";

export class uploadFeedDTO {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  media?: string;

  @IsDateString()
// @IsDate()
  @IsOptional()
  scheduledAt: string | null;
}

export interface ResAddFeedDTO {
  message: string;
  success: boolean;
}
