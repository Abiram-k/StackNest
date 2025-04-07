import { NextFunction, Request, Response } from "express";

export interface IReportController {
    report(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void>;
      
}