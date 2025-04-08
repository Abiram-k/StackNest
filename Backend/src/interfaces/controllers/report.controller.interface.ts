import { NextFunction, Request, Response } from "express";

export interface IReportController {
  report(req: Request, res: Response, next: NextFunction): Promise<void>;

  getAllReports(req: Request, res: Response, next: NextFunction): Promise<void>;
  resolveReport(req: Request, res: Response, next: NextFunction): Promise<void>;
  rejectReport(req: Request, res: Response, next: NextFunction): Promise<void>;
}
