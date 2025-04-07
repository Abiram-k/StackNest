import { IsOptional, IsString } from "class-validator";

export interface ReReportDTO {
    reportedEntity:string,
    reportType:"user" | "room" | "general",
    reason:string,
    message?:string
}

export class ReqReportDTO {
     @IsString()
     reportedEntity: string;
      @IsString()
      reportType: "user" | "room" | "general";
      @IsString()
      reason: string;
      @IsString()
      @IsOptional()
      message: string;
}

