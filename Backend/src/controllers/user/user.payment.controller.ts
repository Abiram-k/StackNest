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
      const isPremiumSubscribed =
        await this._paymentService.capturePaypalPayment(
          user.userId,
          planId,
          orderID
        );
      res.status(HttpStatus.OK).json({
        message: "Paypal payment success",
        success: isPremiumSubscribed,
      });
    } catch (error) {
      next(error);
    }
  }

  async createStripeOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user as { userId: string };
      const { planId } = req.body;
      const clientSecret = await this._paymentService.createStripeOrder(
        user.userId,
        planId
      );
      res.status(HttpStatus.OK).json({
        message: "Stripe payment created",
        success: true,
        clientSecret,
      });
    } catch (error) {
      next(error);
    }
  }

  async stripeWebhook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("From webhook controller ... ");
      const sig = req.headers["stripe-signature"] as string;
      await this._paymentService.stripeWebhook(sig, req.body);
      res.status(200).json({ received: true });
    } catch (error) {
      next(error);
    }
  }
}
