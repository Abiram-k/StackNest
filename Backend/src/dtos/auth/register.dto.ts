import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsNotEmpty,
} from "class-validator";

export class RegisterDTO {
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsString({ message: "Password must be a string" })
  @MinLength(8, { message: "Password should be at least 8 characters long" })
  password: string;
  otp: string;
}

export interface ResRegisterDTO {
  success: boolean;
  message: string;
}
