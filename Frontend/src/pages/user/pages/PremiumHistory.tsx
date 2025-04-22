import { useState, useEffect } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle,
  Clock,
  CreditCard,
  Info,
} from "lucide-react";
import { useGetPremiumHistory } from "@/hooks/user/premium/useGetPremiumHistory";
import { PremiumHistoryDTO } from "@/api/user/premiumService";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";

export default function PremiumHistory() {
  const [premiumHistory, setPremiumHistory] = useState<PremiumHistoryDTO[]>([]);
  const { data, isPending } = useGetPremiumHistory();
  const navigate = useNavigate();

  // Mock data for demonstration
  useEffect(() => {
    if (data) setPremiumHistory(data.history);
  }, [data]);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate days remaining for active subscriptions
  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  // Get status icon
  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "active":
        return (
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
        );
      case "expired":
        return <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case "pending":
        return (
          <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-200 w-screen px-5 mt-12 md:-ms-40 lg:-ms-50 ">
      <div className="container mx-auto px-4 py-8">
        {isPending && <Spinner />}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold dark:text-white md:text-4xl">
            Premium Subscription History
          </h1>
          <p className="mt-2 text-lg dark:text-white/80 ">
            View and manage your premium subscription details
          </p>
        </div>

        {isPending ? (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 dark:border-white border-gray-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {premiumHistory.map((item, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl bg-primary-600 backdrop-blur-lg transition-all duration-200 hover:bg-primary-600/80 dark:bg-black/20 dark:hover:bg-black/30 "
              >
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <StatusIcon status={item.status} />
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    {item.status === "active" && (
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                        {getDaysRemaining(item.endingDate)} days left
                      </span>
                    )}
                  </div>

                  <h2 className="mb-2 text-xl font-bold text-white">
                    {item.plan.title}
                  </h2>
                  <p className="mb-4 text-white/80">{item.plan.description}</p>

                  <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-white/90">
                    <div className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      <span>
                        {formatDate(item.startingDate)} -{" "}
                        {formatDate(item.endingDate)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>
                        ₹{item.plan.discountAmount}
                        <span className="ml-1 text-xs line-through opacity-70">
                          ₹{item.plan.regularAmount}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="mb-2 font-semibold text-white">Benefits:</h3>
                    <ul className="space-y-2">
                      {item.plan.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="mr-2 h-4 w-4 shrink-0 text-green-400" />
                          <span className="text-sm text-white/90">
                            {benefit
                              .split("_")
                              .map((b) => b[0].toUpperCase() + b.slice(1))
                              .join(" ")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {item.status === "expired" && (
                    <button
                      className="mt-4 w-full rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/30"
                      onClick={() =>
                        navigate(
                          `/user/profile/premium-plans/${item.plan._id}/payment`
                        )
                      }
                    >
                      Renew Subscription
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isPending && premiumHistory.length === 0 && (
          <div className="rounded-lg bg-white/10 p-8 text-center backdrop-blur-lg">
            <h2 className="text-xl font-semibold text-white">
              No Premium History Found
            </h2>
            <p className="mt-2 text-white/80">
              You haven't subscribed to any premium plans yet.
            </p>
            <button
              className="mt-4 rounded-lg bg-white px-6 py-2 font-medium text-purple-700 transition-colors hover:bg-white/90"
              onClick={() => navigate("/user/profile/premium-plans")}
            >
              <div className="flex justify-center items-center gap-2">

              <span>Explore Premium Plans</span>{" "}
              <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
