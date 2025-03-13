import { IsString } from "class-validator";

export class InitiateRegistrationDTO {
  @IsString()
  email: string;
}

export interface ResInitiateRegistrationDTO {
  success: true;
  message: string;
}
