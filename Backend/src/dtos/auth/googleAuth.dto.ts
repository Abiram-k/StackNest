import { IsString } from "class-validator";

export class GoogleAuthDTO {
  @IsString()
  token: string;
}
