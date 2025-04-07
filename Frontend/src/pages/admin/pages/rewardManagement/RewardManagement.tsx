import CustomTable from "@/components/CustomTable";
import { FallBackTable } from "@/components/FallBackTable";
import ConfirmationDialog from "@/components/modal/confirmationDialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetAllRewards } from "@/hooks/admin/rewardManagement/useGetAllRewards";
import { useRemoveReward } from "@/hooks/admin/rewardManagement/useRemoveReward";
import { useToggleListReward } from "@/hooks/admin/rewardManagement/useToggleListReward";
import { ResReward } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    key: "name" as keyof ResReward,
    header: "Name",
  },
  { key: "description" as keyof ResReward, header: "Description" },
  { key: "points_cost" as keyof ResReward, header: "Points Cost" },
  { key: "benefit_key" as keyof ResReward, header: "Benefit" },
];

const RewardsManagment = () => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [rewardId, setRewardId] = useState("");
  const navigate = useNavigate();

  const { data: rewardData, isPending: fetchBenefitPending } =
    useGetAllRewards();

  const { mutate: removeMutate, isPending: removePending } = useRemoveReward();

  const { mutate: mutateToggleListing, isPending: togglePending } =
    useToggleListReward();

  const handleEditBenefit = (rewardId: string) => {
    navigate(`${rewardId}/edit`);
  };
  const handleRemoveBenefit = (rewardId: string) => {
    setRewardId(rewardId);
    setIsConfirmationOpen(true);
  };
  const handleConfirmRemoveBenefit = () => {
    removeMutate(rewardId);
    setIsConfirmationOpen(false);
  };

  const handleBlockReward = (reward: ResReward) => {
    mutateToggleListing(reward._id);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black ">
      {(removePending || fetchBenefitPending || togglePending) && <Spinner />}
      {isConfirmationOpen && (
        <ConfirmationDialog
          onConfirm={handleConfirmRemoveBenefit}
          onCancel={() => setIsConfirmationOpen(false)}
          message={`Are you sure to remove this reward?`}
        />
      )}
      <main className="flex-1 p-8 ">
        <div className=" flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-8">Reward Management</h1>
          <Button
            className="bg-green-500 dark:bg-green-500 dark:hover:bg-green-500/90 text-white hover:bg-green-500/90 hover:text-white"
            variant={"outline"}
            onClick={() => navigate("add")}
          >
            <Plus />
            Add new Reward
          </Button>
        </div>
        <div className=" mt-4 md:mt-8 lg:mt-12">
          {rewardData?.rewards?.length ? (
            <CustomTable
              onToggleAction={handleBlockReward}
              toggleKey="isActive"
              data={rewardData.rewards}
              columns={columns}
              handleEdit={handleEditBenefit}
              handleRemove={handleRemoveBenefit}
            />
          ) : (
            <FallBackTable
              mainTitle="No Rewards founded"
              subTitle="Add new Reward now"
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default RewardsManagment;
