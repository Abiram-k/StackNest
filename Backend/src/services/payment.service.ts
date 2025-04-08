import client, {
  getOrdersCaptureRequest,
  getOrdersCreateRequest,
} from "../config/paypal-client";
import * as paypal from "@paypal/checkout-server-sdk";
import { HttpStatus } from "../constants/enum.statusCode";
import { IPremiumRepository } from "../interfaces/repositories/premium.repository.interface";
import { IUserBaseRepository } from "../interfaces/repositories/user.repository.interface";
import { IPaymentService } from "../interfaces/services/payment.service.interface";
import { IPremium } from "../types/IPremium";
import { IUser } from "../types/IUser";
import createHttpError from "http-errors";
import { config } from "dotenv";
config();

export class PaymentService implements IPaymentService {
  private _userRepo: IUserBaseRepository<IUser>;
  private _planRepo: IPremiumRepository<IPremium>;
  constructor(
    userRepo: IUserBaseRepository<IUser>,
    planRepo: IPremiumRepository<IPremium>
  ) {
    this._userRepo = userRepo;
    this._planRepo = planRepo;
  }

  async createPaypalOrder(userId: string, planId: string): Promise<string> {
    try {
      const plan = await this._planRepo.getPremiumById(planId);
      if (!plan)
        throw createHttpError(HttpStatus.NOT_FOUND, "Plan not founded");
      const OrdersCreateRequest = await getOrdersCreateRequest();
      const request = new OrdersCreateRequest();
      request.prefer("return=representation");
      request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: plan.discountAmount.toFixed(2),
            },
          },
        ],
        application_context: {
          brand_name: "StackNest Pro",
          user_action: "PAY_NOW",
          return_url: `${process.env.CLIENT_URL}/user/profile/premium-plans/payment/payment-success`,
          cancel_url: `${process.env.CLIENT_URL}user/profile/premium-plans/payment/payment-canceled`,
        },
      });
      const order = await client.execute(request);
      return order.result.id;
    } catch (error) {
      throw error;
    }
  }

  async capturePaypalPayment(
    userId: string,
    planId: string,
    orderID: string
  ): Promise<boolean> {
    try {
      const OrdersCaptureRequest = await getOrdersCaptureRequest();
      const request = new OrdersCaptureRequest(orderID);
      const capture = await client.execute(request);
      const status = capture.result.status;

      if (status === "COMPLETED") {
        const user = await this._userRepo.findById(userId);
        
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
}
