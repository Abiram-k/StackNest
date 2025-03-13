import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class LoginDTO {
  @IsEmail({}, { message: "Invalid email format" })
  email: string;
  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @IsNotEmpty({ message: "Password is required" })
  password: string;
  @IsOptional()
  @IsString({ message: "Captcha token must be a string" })
  captchaToken?: string;
  @IsString({ message: "Role must be a string" })
  role: string;
}

export interface ResLoginDTO {
  success: boolean;
  accessToken: string;
  message: string;
}
