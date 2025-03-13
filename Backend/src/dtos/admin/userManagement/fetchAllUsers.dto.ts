import { IsOptional, IsString, IsNumber, Min, isString } from "class-validator";
import { UserResTypeDTO } from "../user/userData.dto";

export class FetchAllUsersDTO {
  @IsString()
  filter: string;
  @IsString()
  sort: string;
  @IsString()
  search: string;
  @IsString()
  page: number;
  @IsString()
  limit: number;
}

export class ResFetchAllUsersDTO {
  message: string;
  success: boolean;
  users: UserResTypeDTO[];
  totalPages: number;
}
