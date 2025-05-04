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
    <div className="flex min-h-screen  mt-5 mb-12  w-full  justify-center md:-ms-72  items-center ">
      {fetchingData && <Spinner />}
      <div className="flex-1 w-full px-12">
        <div className=" py-16 px-2 w-full ">
          <div className="flex justify-between items-center align-middle   mb-8">
            <h1 className="text-2xl font-bold text-center">Premium Plans</h1>
            <Button
              variant={"link"}
              className="text-md hover:underline "
              onClick={() => navigate("history")}
            >
              History <ArrowRight />
            </Button>
          </div>
          {/* <div className="w-screen container mx-auto px-4 shadow-md py-12">
            {premiumPlansData?.premiumPlans.length ? (
              <div className="flex flex-col md:flex-row md:flex-wrap gap-5 justify-center">
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
          </div> */}
          <div className="w-full px-4 shadow-md py-12 ">
            {premiumPlansData?.premiumPlans.length ? (
              <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {premiumPlansData.premiumPlans.map((plan, index) => (
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
