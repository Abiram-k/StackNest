import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { axiosInstance } from "@/api/apiSevice";
import { useNavigate } from "react-router-dom";
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const PayPalButton = ({ planId }: { planId: string }) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const createOrder = async (): Promise<string> => {
    try {
      const response = await axiosInstance.post(
        "/users/payment/create-paypal-order",
        { planId }
      );
      return response.data.orderId;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        toast.error((error as { message: string }).message);
      } else {
        toast.error("Failed to create order");
      }
      console.log(error);
      throw new Error("Failed to create PayPal order...");
    }
  };

  const onApprove = async (data: { orderID: string }): Promise<void> => {
    try {
      const response = await axiosInstance.post(
        "/users/payment/capture-paypal-order",
        {
          orderID: data.orderID,
          planId,
        }
      );
      setSuccess(true);
      console.log(response.data);
      if (response.data.success) {
        toast.success("Payment Sucess");
        navigate(`/user/profile/premium-plans/payment/${planId}/success`);
      } else {
        toast.error("Failed to save subscription");
      }
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
