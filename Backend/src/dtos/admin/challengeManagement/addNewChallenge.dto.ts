import { IsNumber, IsString } from "class-validator";

export class AddNewChallengeDTO {
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

export interface ResAddNewChallengeDTO {
  message: string;
  success: boolean;
}
