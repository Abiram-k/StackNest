import { IsNumber, IsString } from "class-validator";

export class UpdateChallengeDTO {
  @IsNumber()
  questionNo: number;
  @IsString()
  question: string;
  @IsString()
  option1: string;
  @IsString()
  option2: string;
  @IsString()
  option3: string;
  @IsString()
  option4: string;
  @IsString()
  answer: string;
}

export interface ResUpdateChallengeDTO {
  message: string;
  success: boolean;
}
