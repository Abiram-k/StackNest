import CustomTable from "@/components/CustomTable";
import { FallBackTable } from "@/components/FallBackTable";
import ConfirmationDialog from "@/components/modal/confirmationDialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetAllChallenges } from "@/hooks/admin/challengeManagement/useGetAllChallenges";
import { useRemoveChallenge } from "@/hooks/admin/challengeManagement/useRemoveChallenge";
import { useToggleListingChallenge } from "@/hooks/admin/challengeManagement/useToggleListChallenge";
import { resChallengeType } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const columns = [
  {
    key: "question" as keyof resChallengeType,
    header: "Question",
  },
  {
    key: "options" as keyof resChallengeType,
    header: "Options",
    render: (challenge: resChallengeType) => (
      <ul className=" pl-5 space-y-1 flex flex-col justify-center items-center ">
        {challenge.options.map((option, index) => (
          <li key={index} className="text-gray-700 text-sm border-b w-fit ">
            {option}
          </li>
        ))}
      </ul>
    ),
  },
  { key: "answer" as keyof resChallengeType, header: "Answer" },
];

const ChallengeManagment = () => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const navigate = useNavigate();

  const { data, isPending } = useGetAllChallenges();

  const { mutate: removeMutate, isPending: removePending } =
    useRemoveChallenge();

  const { mutate: toggleListingMutate, isPending: toggleIsPending } =
    useToggleListingChallenge();

  const handleEdit = (challenge_id: string) => {
    navigate(`/admin/challenge-management/${challenge_id}/edit`);
  };

  const handleRemoveChallenge = (challenge_id: string) => {
    setIsConfirmationOpen(true);
    setSelectedChallenge(challenge_id);
  };

  const handleBlockChallenge = (challenge: resChallengeType) => {
    toggleListingMutate(challenge._id);
  };

  const handleConfirm = () => {
    removeMutate(selectedChallenge);
    setIsConfirmationOpen(false);
  };
  
  const handleCancel = () => {
    toast.success("Action Cancelled");
    setIsConfirmationOpen(false);
  };

  return (
    <main className="flex-1 p-8 ">
      {(isPending || removePending || toggleIsPending) && <Spinner />}
      {isConfirmationOpen && (
        <ConfirmationDialog
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          message={`Are you sure to remove this challenge?`}
        />
      )}
      <div className="flex-1 flex  p-8  w-full justify-between items-center align-middle">
        <h1 className="text-2xl font-bold border-b pb-2 ">
          Challenge Management
        </h1>
        <Button
          className="bg-green-500 dark:bg-green-500 dark:hover:bg-green-500/90 text-white hover:bg-green-500/90 hover:text-white"
          variant={"outline"}
          onClick={() => navigate("/admin/challenge-management/add")}
        >
          <Plus />
          Add new Challenge
        </Button>
      </div>
      <div className=" mt-4 md:mt-8 lg:mt-12">
        {data?.challenges?.length ? (
          <CustomTable
            onToggleAction={handleBlockChallenge}
            toggleKey="isListed"
            data={data.challenges}
            columns={columns}
            handleEdit={handleEdit}
            handleRemove={handleRemoveChallenge}
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

export default ChallengeManagment;
