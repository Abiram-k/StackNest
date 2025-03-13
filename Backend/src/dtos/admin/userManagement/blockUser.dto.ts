import { IsString } from "class-validator";

export class BlockUserDTO {
  @IsString()
  userName: string;
}


export interface ResBlockUserDTO {
message:string;
success:boolean;
}