import { IsString, MinLength } from "class-validator";

export class VerifyPasswordDTO {
  @IsString()
  @MinLength(6, { message: "Password must be 6 characters" })
  password: string;
}

export interface ResVerifyPasswordDTO {
  message: string;
  success: boolean;
}
