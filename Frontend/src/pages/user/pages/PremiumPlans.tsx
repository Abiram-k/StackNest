import PricingCard from "@/components/card/PricingCard";
import { FallBackTable } from "@/components/FallBackTable";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetListedPremium } from "@/hooks/user/premium/useGetListedPremium";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PremiumPlans = () => {
  const navigate = useNavigate();
  const { data: premiumPlansData, isPending: fetchingData } =
    useGetListedPremium();

  return (
    <div className="flex min-h-screen bg-background w-full md:w-1/2 justify-center items-center">
      {fetchingData && <Spinner />}
      <div className="flex-1">
        <div className="max-w-3xl mx-auto py-16 px-4">
          <div className="flex justify-between items-center align-middle  mb-8">
            <h1 className="text-2xl font-bold text-center">Premium Plans</h1>
            <Button
              variant={"link"}
              className="text-md hover:underline"
              onClick={() => navigate("history")}
            >
              History <ArrowRight />
            </Button>
          </div>
          <div className="container mx-auto px-4 shadow-md py-12">
            {premiumPlansData?.premiumPlans.length ? (
              <div className="flex flex-col md:flex-row md:flex-wrap gap-6 justify-center">
                {premiumPlansData?.premiumPlans.map((plan, index) => (
                  <PricingCard key={index} plan={plan} />
                ))}
              </div>
            ) : (
              <FallBackTable
                mainTitle="No latest plans are there!"
                subTitle="We will notify once updated"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPlans;
