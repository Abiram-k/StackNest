import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import PayPalButton from "@/components/auth/PayPalButton";
import { useNavigate, useParams } from "react-router-dom";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeCheckoutForm from "@/components/StripeCheckoutForm";
import axios from "axios";
import { axiosInstance } from "@/api/apiSevice";
import { toast } from "sonner";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY!);

export default function PaymentListPage() {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  // const stripe = useStripe();
  // const elements = useElements();
  const [stripeClientSecret, setStripeClientSecret] = useState("");

  const navigate = useNavigate();
  const { planId } = useParams<{ planId: string }>();
  useEffect(() => {
    if (!planId) navigate(-1);
  }, [planId]);

  const handlePaymentSelect = async (method: string) => {
    setSelectedPayment(method);
    try {
      const response = await axiosInstance.post(
        "/users/create-payment-intent",
        {
          planId,
        }
      );

      const data = response.data;
      setStripeClientSecret(data.clientSecret);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayment = () => {
    if (!selectedPayment) toast.info("Please select a payment method");
  };

  return (
    <div className="min-h-screen flex flex-col w-full md:-ms-52 lg:-ms-72">
      <div className="flex flex-1">
        <main className="flex-1 py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-12 ">
              Payment Page
            </h1>

            <div className="bg-gray-100 dark:bg-gray-900 rounded-3xl p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div
                  className={`bg-white dark:bg-black rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer border-2 ${
                    selectedPayment === "paypal"
                      ? "border-indigo-500"
                      : "border-transparent"
                  }`}
                  onClick={() => handlePaymentSelect("paypal")}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                      {selectedPayment === "paypal" && (
                        <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                      )}
                    </div>
                  </div>
                  <div className="h-12 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="80"
                      height="24"
                      viewBox="0 0 124 33"
                    >
                      <path
                        fill="#253B80"
                        d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.97-1.142-2.694-1.746-4.985-1.746zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z"
                      />
                      <path
                        fill="#179BD7"
                        d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.746-4.983-1.746zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.359.42.468 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.34.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z"
                      />
                      <path
                        fill="#253B80"
                        d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2c-.696.494-1.523.869-2.458 1.109-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035H7.266z"
                      />
                      <path
                        fill="#179BD7"
                        d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z"
                      />
                      <path
                        fill="#222D65"
                        d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.177h-7.352a1.172 1.172 0 0 0-1.159.992L8.05 17.605l-.045.289a1.336 1.336 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.594 6.594 0 0 0-1.017-.429 9.045 9.045 0 0 0-.277-.087z"
                      />
                      <path
                        fill="#253B80"
                        d="M9.614 7.699a1.169 1.169 0 0 1 1.159-.991h7.352c.871 0 1.684.057 2.426.177a9.757 9.757 0 0 1 1.481.353c.365.121.704.264 1.017.429.368-2.347-.003-3.945-1.272-5.392C20.378.682 17.853 0 14.622 0h-9.38c-.66 0-1.223.48-1.325 1.133L.01 25.898a.806.806 0 0 0 .795.932h5.791l1.454-9.225 1.564-9.906z"
                      />
                    </svg>
                  </div>
                  <p className="text-center mt-2">PayPal</p>
                </div>

                <div
                  className={`bg-white dark:bg-black rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer border-2 ${
                    selectedPayment === "stripe"
                      ? "border-indigo-500"
                      : "border-transparent"
                  }`}
                  onClick={() => handlePaymentSelect("stripe")}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                      {selectedPayment === "stripe" && (
                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                      )}
                    </div>
                  </div>
                  <div className="h-12 flex items-center justify-center">
                    <img
                      src="/stripe_logo.png"
                      alt=""
                      width={120}
                      height={120}
                    />
                  </div>
                  <p className="text-center mt-2">Stripe</p>
                </div>

                <div
                  className={`bg-white dark:bg-black rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer border-2 ${
                    selectedPayment === "card"
                      ? "border-indigo-500"
                      : "border-transparent"
                  }`}
                  onClick={() => handlePaymentSelect("card")}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                      {selectedPayment === "card" && (
                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                      )}
                    </div>
                  </div>
                  <div className="h-12 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-6 bg-yellow-300 rounded-sm relative">
                        <div className="absolute top-4 left-0 w-8 h-1 bg-gray-700"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center mt-2">Credit / Debit Card</p>
                </div>
              </div>

              {selectedPayment == "paypal" && <PayPalButton planId={planId!} />}
              {!selectedPayment && (
                <Button
                  className="w-full py-6 text-lg bg-primary-500 dark:bg-primary-600 dark:hover:bg-primary-600/90 cursor-pointer dark:text-white  hover:bg-primary-500/90"
                  disabled={!selectedPayment}
                  onClick={handlePayment}
                >
                  Pay Now
                </Button>
              )}

              {selectedPayment === "stripe" && stripeClientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret: stripeClientSecret }}
                >
                  <StripeCheckoutForm planId={planId!} />
                </Elements>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
