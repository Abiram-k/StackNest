import { IsString } from "class-validator";

export class GenerateAccessDTO {
  @IsString({ message: "No role founded during generating new access token" })
  role: string;
}

export interface ResGenerateAccessDTO {
  success: boolean;
  accessToken: string;
  message: string;
}
