import { IsEmail } from "class-validator";

export class ForgotPasswordDTO {
  @IsEmail()
  email: string;
}

export interface ResForgotPasswordDTO {
  success: boolean;
  message: string;
}
