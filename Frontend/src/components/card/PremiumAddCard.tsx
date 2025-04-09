import type { FC } from "react";
import { Crown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PremiumAddCard: FC = () => {
  const navigate = useNavigate();
  return (
    <div className="hidden lg:block rounded-xl overflow-hidden h-fit shadow-md hover:shadow-xl hover:scale-105 duration-250  w-full  bg-white dark:bg-gray-800">
      <div className="bg-[#7848F4] dark:bg-[#5A32B8] p-4 flex items-center justify-between">
        <h3 className="text-white font-bold">Premium</h3>
        <Crown className="h-5 w-5 text-yellow-300" />
      </div>

      <div className="p-4">
        <div className="mb-3">
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Upgrade to premium and unlock all features
          </p>
        </div>

        <ul className="space-y-2 mb-4">
          <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Check className="h-4 w-4 mr-2 text-[#7848F4] dark:text-[#5A32B8]" />
            <span>Premium room creation</span>
          </li>
          <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Check className="h-4 w-4 mr-2 text-[#7848F4] dark:text-[#5A32B8]" />
            <span>Prior customer support</span>
          </li>
          <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Check className="h-4 w-4 mr-2 text-[#7848F4] dark:text-[#5A32B8]" />
            <span>Premium badge</span>
          </li>
        </ul>

        <div className="flex items-baseline mb-4">
          <span className="text-xl font-bold text-gray-800 dark:text-white">
          ₹579.00
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
            /month
          </span>
        </div>

        <Button
          onClick={() => navigate("/user/profile/premium-plans")}
          className="w-full bg-[#7848F4] hover:bg-[#6A3AD6] dark:bg-[#5A32B8] dark:hover:bg-[#4D2A9E] text-white dark:text-white"
        >
          Subscribe Now
        </Button>
      </div>
    </div>
  );
};

export default PremiumAddCard;
