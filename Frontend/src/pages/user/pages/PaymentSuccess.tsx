import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CheckCircle, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetSelectedPremium } from "@/hooks/user/premium/useGetSelectedPremium";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
// import { useRef } from "react";

export default function PaymentSuccess() {
  const { planId } = useParams<{ planId: string }>();
  //   const receiptRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  if (!planId) navigate(-2);
  const { data: premiumPlanData, isPending } = useGetSelectedPremium(planId!);

  const savingsAmount =
    premiumPlanData &&
    premiumPlanData?.premiumPlan?.regularAmount -
      premiumPlanData?.premiumPlan.discountAmount;
  const savingsPercentage =
    premiumPlanData &&
    savingsAmount &&
    Math.round(
      (savingsAmount / premiumPlanData.premiumPlan.regularAmount) * 100
    );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b mt-10 mb-30 md:ms-20 from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        {isPending && <Spinner />}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Payment Successful!
            </h1>
            <p className="mt-3 text-xl text-gray-500 dark:text-gray-400">
              Thank you for subscribing to StackNest PRO
            </p>
          </div>

          <Card className="mb-8 border-2 border-green-200 dark:border-green-800 shadow-lg">
            <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800">
              <CardTitle className="flex items-center text-2xl">
                <Star className="mr-2 h-6 w-6 text-yellow-500" />
                {premiumPlanData?.premiumPlan.title} Subscription
              </CardTitle>
              <CardDescription className="text-base">
                {premiumPlanData?.premiumPlan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Subscription Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Plan
                      </span>
                      <span className="font-medium">
                        {premiumPlanData?.premiumPlan.title}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Duration
                      </span>
                      <span className="font-medium">
                        {premiumPlanData &&
                        premiumPlanData?.premiumPlan.periodInDays >= 365
                          ? "1 Year+"
                          : `${premiumPlanData?.premiumPlan.periodInDays} days`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Regular Price
                      </span>
                      <span className="font-medium line-through text-gray-400">
                        ${premiumPlanData?.premiumPlan.regularAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Your Price
                      </span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        $
                        {premiumPlanData?.premiumPlan.discountAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                      <span>You Save</span>
                      <span>
                        ${savingsAmount && savingsAmount.toFixed(2)} (
                        {savingsPercentage}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Plan Benefits</h3>
                  <ul className="space-y-2">
                    {premiumPlanData?.premiumPlan.benefits.map(
                      (benefit, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 bg-slate-50 dark:bg-slate-900/50 border-t">
              {/* <Button className="w-full sm:w-auto" onClick={downloadReceipt}>
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button> */}
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
