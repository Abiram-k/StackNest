import { Types } from "mongoose";
import { HttpStatus } from "../constants/enum.statusCode.js";
import { IReportController } from "../interfaces/controllers/report.controller.interface.js";
import { IReportService } from "../interfaces/services/report.service.interface.js";
import { NextFunction, Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { ReqReportDTO } from "../dtos/user/report/report.dto.js";
import { validate } from "class-validator";
import { validateDtoError } from "../utils/ValidateDtoError.js";

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

  async getAllReports(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const filter = String(req.query.filter) || "";
      const sort = String(req.query.sort) || "";
      const page = Number(req.query.page) || 0;
      const limit = Number(req.query.limit) || 0;
      const { reports, totalPages } = await this._reportService.getAllReports(
        filter,
        sort,
        page,
        limit
      );
      res.status(HttpStatus.OK).json({
        message: "Reports fetched",
        success: true,
        reports,
        totalPages,
      });
    } catch (error) {
      throw error;
    }
  }

  async resolveReport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { reportId } = req.body;
      await this._reportService.resolveReport(reportId);
      res
        .status(HttpStatus.OK)
        .json({ message: "Successfully resolved report", success: true });
    } catch (error) {
      next(error);
    }
  }
  async rejectReport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { reportId } = req.body;
      await this._reportService.rejectReport(reportId);
      res
        .status(HttpStatus.OK)
        .json({ message: "Successfully rejected report", success: true });
    } catch (error) {
      next(error);
    }
  }
}
