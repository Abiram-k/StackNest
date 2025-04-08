import { NextFunction, Request, Response } from "express";
import { IUserPaymentController } from "../../interfaces/controllers/user.payment.controller.interface";
import { IPaymentService } from "../../interfaces/services/payment.service.interface";
import { HttpStatus } from "../../constants/enum.statusCode";

export class UserPaymentController implements IUserPaymentController {
  private _paymentService: IPaymentService;
  constructor(paymentService: IPaymentService) {
    this._paymentService = paymentService;
  }

  async createPaypalOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user as { userId: string };
      const { planId } = req.body;
      const orderId = await this._paymentService.createPaypalOrder(
        user.userId,
        planId
      );
      res
        .status(HttpStatus.OK)
        .json({ message: "Paypal payment created", success: true, orderId });
    } catch (error) {
      next(error);
    }
  }

  async capturePaypalPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user as { userId: string };
      const { orderID, planId } = req.body;
      await this._paymentService.capturePaypalPayment(
        user.userId,
        planId,
        orderID
      );
      res
        .status(HttpStatus.OK)
        .json({ message: "Paypal payment success", success: true });
    } catch (error) {
      next(error);
    }
  }
}
