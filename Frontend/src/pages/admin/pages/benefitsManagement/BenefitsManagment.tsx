import CustomTable from "@/components/CustomTable";
import { FallBackTable } from "@/components/FallBackTable";
import ConfirmationDialog from "@/components/modal/confirmationDialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetAllBenefit } from "@/hooks/admin/benefitsManagement/useGetAllBenefits";
import { useRemoveBenefit } from "@/hooks/admin/benefitsManagement/useRemoveBenefits";
import { useToggleListBenefit } from "@/hooks/admin/benefitsManagement/useToggleListBenefit";
import { ResBenefit } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    key: "name" as keyof ResBenefit,
    header: "Name",
  },
  { key: "description" as keyof ResBenefit, header: "Description" },
];

const BenefitsManagment = () => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [benefitId, setBenefitId] = useState("");
  const navigate = useNavigate();

  const { data: benefitsData, isPending: fetchBenefitPending } =
    useGetAllBenefit();

  const { mutate: removeMutate, isPending: removePending } = useRemoveBenefit();

  const { mutate: mutateToggleListing, isPending: togglePending } =
    useToggleListBenefit();
  const handleEditBenefit = (benefitId: string) => {
    navigate(`${benefitId}/edit`);
  };
  const handleRemoveBenefit = (benefitId: string) => {
    setBenefitId(benefitId);
    setIsConfirmationOpen(true);
  };
  const handleConfirmRemoveBenefit = () => {
    removeMutate(benefitId);
    setIsConfirmationOpen(false);
  };

  const handleBlockUser = (benefit: ResBenefit) => {
    mutateToggleListing(benefit._id);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black ">
      {(removePending || fetchBenefitPending || togglePending) && <Spinner />}
      {isConfirmationOpen && (
        <ConfirmationDialog
          onConfirm={handleConfirmRemoveBenefit}
          onCancel={() => setIsConfirmationOpen(false)}
          message={`Are you sure to remove this benefit?`}
        />
      )}
      <main className="flex-1 p-8 ">
        <div className=" flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-8">Benefit Management</h1>
          <Button
            className="bg-green-500 dark:bg-green-500 dark:hover:bg-green-500/90 text-white hover:bg-green-500/90 hover:text-white"
            variant={"outline"}
            onClick={() => navigate("add")}
          >
            <Plus />
            Add new Benefit
          </Button>
        </div>
        <div className=" mt-4 md:mt-8 lg:mt-12">
          {benefitsData?.benefits?.length ? (
            <CustomTable
              onToggleAction={handleBlockUser}
              toggleKey="isActive"
              data={benefitsData.benefits}
              columns={columns}
              handleEdit={handleEditBenefit}
              handleRemove={handleRemoveBenefit}
            />
          ) : (
            <FallBackTable
              mainTitle="No Benefits founded"
              subTitle="Add new Benefits now"
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default BenefitsManagment;
