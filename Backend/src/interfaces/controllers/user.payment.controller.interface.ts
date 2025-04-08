import { NextFunction, Request, Response } from "express";

export interface IUserPaymentController {
  createPaypalOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  capturePaypalPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
