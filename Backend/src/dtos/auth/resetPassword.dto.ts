import { IsString, MinLength } from "class-validator";

export class ResetPasswordDTO {
  @IsString()
  token: string;
  @IsString()
  @MinLength(6, { message: "Password shorter than 6 characters" })
  password: string;
}

export interface ResResetPasswordDTO {
  success: boolean;
  message: string;
}
