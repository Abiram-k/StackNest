import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { axiosInstance } from "@/api/apiSevice";
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const PayPalButton = ({ planId }: { planId: string }) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (): Promise<string> => {
    try {
      const response = await axiosInstance.post(
        "/users/payment/create-paypal-order",
        { planId }
      );

      console.log("Resonse of create paypal order", response);
      return response.data.orderId;
    } catch (error) {
      toast.error("Failed to create order");
      console.log(error);
      throw new Error("Failed to create paypal order...");
    }
  };

  const onApprove = async (data: { orderID: string }): Promise<void> => {
    try {
      await axiosInstance.post("/users/payment/capture-paypal-order", {
        orderID: data.orderID,
        planId,
      });
      setSuccess(true);
    } catch (err) {
      setError("Payment failed");
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id": PAYPAL_CLIENT_ID!,
        currency: "USD",
      }}
    >
      {error && <p className="error text-red-600 mb-1">{error}</p>}
      {success ? (
        <div className="success text-green-500">Payment Successful! ✨</div>
      ) : (
        <PayPalButtons
          style={{ layout: "horizontal" }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(err: any) => setError(err.toString())}
        />
      )}
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
