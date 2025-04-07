import PricingCard from "@/components/card/PricingCard";
import { FallBackTable } from "@/components/FallBackTable";
import { Spinner } from "@/components/ui/spinner";
import { useGetListedPremium } from "@/hooks/user/premium/useGetListedPremium";

const PremiumPlans = () => {
  const { data: premiumPlansData, isPending: fetchingData } =
    useGetListedPremium();

  return (
    <div className="flex min-h-screen bg-background md:w-1/2 justify-center items-center">
      {fetchingData && <Spinner />}
      <div className="flex-1">
        <div className="max-w-3xl mx-auto py-16 px-4">
          <h1 className="text-2xl font-bold mb-8 text-center">
            Premium Plans
          </h1>
          <div className="container mx-auto px-4 shadow-md py-12">
            {premiumPlansData?.premiumPlans.length ? (
              <div className="flex flex-col md:flex-row md:flex-wrap gap-6 justify-center">
                {premiumPlansData?.premiumPlans.map((plan, index) => (
                  <PricingCard key={index} plan={plan} />
                ))}
              </div>
            ) : (
              <FallBackTable
                mainTitle="No plans are there"
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
