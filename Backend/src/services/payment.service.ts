import client, {
  getOrdersCaptureRequest,
  getOrdersCreateRequest,
} from "../config/paypal-client";
import { HttpStatus } from "../constants/enum.statusCode";
import { IPremiumRepository } from "../interfaces/repositories/premium.repository.interface";
import { IUserBaseRepository } from "../interfaces/repositories/user.repository.interface";
import { IPaymentService } from "../interfaces/services/payment.service.interface";
import { IPremium } from "../types/IPremium";
import { IUser } from "../types/IUser";
import createHttpError from "http-errors";
import { config } from "dotenv";
import Stripe from "stripe";
import { IPremiumHistory } from "../types/IPremiumHistory";
config();
const stripe = new Stripe(process.env.STRIPE_SECERET!, {
  apiVersion: "2025-03-31.basil",
});

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
        throw createHttpError(HttpStatus.NOT_FOUND, "Plan not avalable");
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
        const planData = await this._planRepo.getPremiumById(planId);
        if (!planData)
          throw createHttpError(HttpStatus.NOT_FOUND, "Plan not founded");
        const user = await this._userRepo.findById(userId);
        if (!user)
          throw createHttpError(HttpStatus.NOT_FOUND, "User not founded");

        const isSubscribeAlready = user.premiumHistory.some(
          (plan) =>
            String(plan.premiumPlan) == planId && plan.status == "active"
        );

        if (isSubscribeAlready) {
          throw createHttpError(
            HttpStatus.BAD_REQUEST,
            "Already subscribed this plan"
          );
        }
        const startingDate = new Date();
        const paymentData: IPremiumHistory = {
          status: "active",
          startingDate,
          endingDate: new Date(
            startingDate.getTime() +
              Number(planData.periodInDays) * 24 * 60 * 60 * 1000
          ),
          premiumPlan: planData._id,
        };

        const benefitData: {
          planId: string;
          benefitKeys: string[];
          redeemedAt: Date;
        } = {
          planId: planData._id,
          benefitKeys: planData.benefits,
          redeemedAt: startingDate,
        };
        await this._userRepo.subscribePremium(userId, paymentData, benefitData);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  async createStripeOrder(userId: string, planId: string): Promise<string> {
    try {
      if (!userId)
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          "User Id not founded, stripe(create)"
        );
      if (!planId)
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          "Plan Id not founded, stripe(create)"
        );
      const plan = await this._planRepo.getPremiumById(planId);

      if (!plan)
        throw createHttpError(HttpStatus.NOT_FOUND, "Plan not avalable");
      const paymentIntent = await stripe.paymentIntents.create({
        amount: plan.discountAmount * 100,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      if (paymentIntent.client_secret) {
        const planData = await this._planRepo.getPremiumById(planId);
        if (!planData)
          throw createHttpError(HttpStatus.NOT_FOUND, "Plan not founded");
        const user = await this._userRepo.findById(userId);
        if (!user)
          throw createHttpError(HttpStatus.NOT_FOUND, "User not founded");

        const isSubscribeAlready = user.premiumHistory.some(
          (plan) =>
            String(plan.premiumPlan) == planId && plan.status == "active"
        );

        if (isSubscribeAlready) {
          throw createHttpError(
            HttpStatus.BAD_REQUEST,
            "Already subscribed this plan"
          );
        }

        const startingDate = new Date();
        const paymentData: IPremiumHistory = {
          status: "active",
          startingDate,
          endingDate: new Date(
            startingDate.getTime() +
              Number(planData.periodInDays) * 24 * 60 * 60 * 1000
          ),
          premiumPlan: planData._id,
        };

        const benefitData: {
          planId: string;
          benefitKeys: string[];
          redeemedAt: Date;
        } = {
          planId: planData._id,
          benefitKeys: planData.benefits,
          redeemedAt: startingDate,
        };
        await this._userRepo.subscribePremium(userId, paymentData, benefitData);
      }
      if (!paymentIntent.client_secret) {
        console.log("Not payment intent client secret founded. returned ' ' ");
        return "";
      }
      return paymentIntent.client_secret;
    } catch (error) {
      throw error;
    }
  }

  async stripeWebhook(sig: any, reqBody: any): Promise<any> {
    let event: Stripe.Event;

    console.log("SIG: ", sig);
    console.log("REQ BODY: ", reqBody);
    try {
      event = stripe.webhooks.constructEvent(
        reqBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );

      // 🎯 TypeScript narrowing for event types
      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        console.log("✅ PaymentIntent was successful:", paymentIntent.id);
      }
    } catch (error) {
      throw error;
    }
  }
}
