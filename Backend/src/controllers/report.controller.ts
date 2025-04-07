import { Types } from "mongoose";
import { HttpStatus } from "../constants/enum.statusCode";
import { IReportController } from "../interfaces/controllers/report.controller.interface";
import { IReportService } from "../interfaces/services/report.service.interface";
import { NextFunction, Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { ReqReportDTO } from "../dtos/user/report/report.dto";
import { validate } from "class-validator";
import { validateDtoError } from "../utils/ValidateDtoError";

export class ReportController implements IReportController {
  private _reportService: IReportService;
  constructor(reportService: IReportService) {
    this._reportService = reportService;
  }
  async report(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.user as { userId: Types.ObjectId; role: string };
      const dto = plainToInstance(ReqReportDTO, req.body);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      await this._reportService.report({ reporterId: userId, ...dto });
      res
        .status(HttpStatus.OK)
        .json({ message: "Successfully reported", success: true });
    } catch (error) {
      next(error);
    }
  }
}
