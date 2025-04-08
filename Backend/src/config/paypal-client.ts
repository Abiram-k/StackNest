import { config } from "dotenv";
import * as paypal from "@paypal/checkout-server-sdk";

config();

const PAYPAL_SECERET = process.env.PAYPAL_SECERET;
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;

if (!PAYPAL_CLIENT_ID || !PAYPAL_SECERET) {
  throw new Error("Paypal seceret or client id is missing!!!");
}

const environment = new paypal.core.SandboxEnvironment(
  PAYPAL_CLIENT_ID,
  PAYPAL_SECERET
);
const client = new paypal.core.PayPalHttpClient(environment);

const getOrdersCreateRequest = async () => {
  // @ts-ignore
  const module = await import("@paypal/checkout-server-sdk/lib/orders/ordersCreateRequest.js");
  return module.OrdersCreateRequest;
};
const getOrdersCaptureRequest = async () => {
  // @ts-ignore
  const module = await import("@paypal/checkout-server-sdk/lib/orders/ordersCaptureRequest.js");
  return module.OrdersCaptureRequest;
};

export default client;
export { paypal, getOrdersCreateRequest,getOrdersCaptureRequest  };
