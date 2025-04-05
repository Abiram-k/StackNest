import CustomTable from "@/components/CustomTable";
import { FallBackTable } from "@/components/FallBackTable";
import ConfirmationDialog from "@/components/modal/confirmationDialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetAllPremium } from "@/hooks/admin/premiumManagment/useGetAllPremium";
import { useRemovePremium } from "@/hooks/admin/premiumManagment/useRemovePremium";
import { useToggleListPremium } from "@/hooks/admin/premiumManagment/useToggleListPremium";
import { ResPremium } from "@/types";
import { Plus } from "lucide-react";
import  { useState } from "react";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    key: "title" as keyof ResPremium,
    header: "Title",
  },
  {
    key: "description" as keyof ResPremium,
    header: "Description",
  },
  {
    key: "benefits" as keyof ResPremium,
    header: "Options",
    render: (plan: ResPremium) => (
      <ul className=" pl-5 space-y-1 flex flex-col justify-center items-center ">
        {plan.benefits.map((benefit, index) => (
          <li key={index} className="text-gray-700 text-sm border-b w-fit ">
            {benefit}
          </li>
        ))}
      </ul>
    ),
  },
  { key: "discountAmount" as keyof ResPremium, header: "Discount Amount" },
];

const PremiumManagement = () => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const navigate = useNavigate();

  const { data: premiumPlandata, isPending: fetchingPremium } =
    useGetAllPremium();

  console.log(premiumPlandata);

  const { mutate: listingMutate, isPending: ListingPending } =
    useToggleListPremium();
  const { mutate: removeMutate, isPending: removePending } = useRemovePremium();

  const handleEdit = (planId: string) => {
    navigate(`${planId}/edit`);
  };

  const handleListPremium = (plan: ResPremium) => {
    listingMutate(plan._id);
  };

  const handleRemovePlan = (planId: string) => {
    setSelectedPlan(planId);
    setIsConfirmationOpen(true);
  };
  const handleRemovePlanWithConfirm = () => {
    removeMutate(selectedPlan);
    setIsConfirmationOpen(false);
  };

  return (
    <main className="flex-1 p-8 ">
      {(fetchingPremium || ListingPending || removePending) && <Spinner />}
      {isConfirmationOpen && (
        <ConfirmationDialog
          onConfirm={handleRemovePlanWithConfirm}
          onCancel={() => setIsConfirmationOpen(false)}
          message={`Are you sure to remove this Premium plan ?`}
        />
      )}
      <div className="flex-1 flex  p-8  w-full justify-between items-center align-middle">
        <h1 className="text-2xl font-bold border-b pb-2 ">
          Premium Plans Management
        </h1>
        <Button
          className="bg-green-500 dark:bg-green-500 dark:hover:bg-green-500/90 text-white hover:bg-green-500/90 hover:text-white"
          variant={"outline"}
          onClick={() => navigate("add")}
        >
          <Plus />
          Add new Plan
        </Button>
      </div>
      <div className=" mt-4 md:mt-8 lg:mt-12">
        {premiumPlandata?.premiumPlans?.length ? (
          <CustomTable
            onToggleAction={handleListPremium}
            toggleKey="isListed"
            data={premiumPlandata.premiumPlans}
            columns={columns}
            handleEdit={handleEdit}
            handleRemove={handleRemovePlan}
          />
        ) : (
          <FallBackTable
            mainTitle="No Challenges founded"
            subTitle="Add new challenges now"
          />
        )}
      </div>
    </main>
  );
};

export default PremiumManagement;
