import { ResPremium } from "@/types";
import { Check, Circle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface PricingCardProps {
  plan: ResPremium;
}

export default function PricingCard({ plan }: PricingCardProps) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  const savings = plan.regularAmount - plan.discountAmount;

  const getBackgroundColor = (savings: number) => {
    if (savings > 1000) return "bg-yellow-600";
    if (savings > 500) return "bg-purple-600";
    if (savings >= 100) return "bg-green-500";
    return "bg-gray-400";
  };

  const bgColor = getBackgroundColor(savings);
  const navigate = useNavigate();

  useEffect(() => {
    if (plan.periodInDays === 1) {
      const endTime = new Date().getTime() + 24 * 60 * 60 * 1000;
      if (!localStorage.getItem(`${plan.title}-endAt`))
        localStorage.setItem(`${plan.title}-endAt`, String(endTime));
      const updateTimer = () => {
        const now = new Date().getTime();
        const distance =
          Number(localStorage.getItem(`${plan.title}-endAt`)) - now;
        if (distance <= 0) {
          setTimeLeft("Expired");
          localStorage.removeItem(`${plan.title}-endAt`);
          return;
        }
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [plan.periodInDays]);

  return (
    <div
      className={`${bgColor} rounded-3xl p-6 text-white flex flex-col w-80 h-[600px] mx-auto`}
    >
      <div className="mb-4">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-white">
          <Circle className="w-4 h-4 fill-white" />
        </div>
      </div>

      <div className="mb-2">
        <h2 className="text-2xl font-bold">{plan.title}</h2>
        <p className="text-white/80">{plan.description}</p>
      </div>

      <div className="mb-6">
        <span className="text-2xl line-through text-white/60 mr-2">
          ₹{plan.regularAmount}
        </span>
        <span className="text-4xl font-bold">
          ₹{plan.discountAmount}/
          <span className="text-2xl">{plan.periodInDays}d</span>
        </span>
      </div>

      {plan.periodInDays === 1 && timeLeft && (
        <div className="mb-4 text-orange-900 font-semibold">
          Expires in: {timeLeft}
        </div>
      )}

      <button
        className="bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg mb-8 transition-colors"
        onClick={() => navigate(`${plan._id}/payment`)}
      >
        Select
      </button>

      <div className="border-t border-white/20 pt-4 mt-auto flex-1 min-h-0">
        <p className="font-medium mb-4">What you will get</p>
        <div className="overflow-y-auto h-full pr-2">
          <ul className="space-y-3">
            {plan.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <Check className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span className="flex-1">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
