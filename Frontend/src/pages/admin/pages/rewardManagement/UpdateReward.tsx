import DetailsForm from "@/components/forms/DetailsForm";
import { Spinner } from "@/components/ui/spinner";
import { useGetSelectedReward } from "@/hooks/admin/rewardManagement/useGetSelectedReward";
import { useUpdateReward } from "@/hooks/admin/rewardManagement/useUpdateReward";
import { useVerifyRewardForm } from "@/hooks/validation/useRewardForm";
import { ReqReward } from "@/types";
import { validateRewardSchema } from "@/validation/rewardSchema";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const benefitOptions = [
  { label: "Extra profile edit", value: "extra_profile_edit" },
  { label: "One premium room creation", value: "one_premium_room_creation" },
  { label: "Temperory premium access", value: "temporary_premium_access" },
  { label: "Fast customer support", value: "fast_customer_support" },
];

const UpdateReward = () => {
  const {
    register,
    setValue,
    reset,
    formState: { errors },
    handleSubmit,
  } = useVerifyRewardForm({
    schema: validateRewardSchema,
    defaultValues: {
      description: "",
      name: "",
      benefit_key: "",
      points_cost: 0,
    },
  });

  const navigate = useNavigate();
  const { rewardId } = useParams<{ rewardId: string }>();
  if (!rewardId) {
    toast.warning("reward id not founded");
    navigate(-1);
  }

  const { data: rewardData, isPending: fetchPending } = useGetSelectedReward(
    rewardId!
  );

  const { mutate: updateMutate, isPending: updatePending } =
    useUpdateReward();

  useEffect(() => {
    reset(rewardData?.reward);
  }, [rewardData?.reward]);

  const handleAddReward = (data: ReqReward) => {
    updateMutate({ rewardId: rewardId!, data });
  };

  return (
    <div className="flex h-screen dark:bg-black w-full">
      {(fetchPending || updatePending) && <Spinner />}
      <main className="flex-1 p-8  w-full">
        <h1 className="text-2xl font-bold mb-8 border-b pb-2">Update Reward</h1>
        <div className="w-full flex flex-col justify-between p-10  rounded">
          <div className="md:ms-14 lg:ms-32 w-full">
            <DetailsForm
              isEditing={true}
              register={register}
              onSubmit={handleSubmit(handleAddReward)}
              errors={errors}
              submitButtonText="Submit"
              fields={[
                [
                  {
                    name: "name",
                    label: "Name:",
                    type: "text",
                    placeholder: "Enter name ",
                    setValue,
                  },
                  {
                    name: "points_cost",
                    label: "Points Cost:",
                    type: "number",
                    placeholder: "Enter Cost ",
                    setValue,
                  },
                ],
                [
                  {
                    name: "description",
                    label: "Description:",
                    type: "textarea",
                    placeholder: "Enter Description ",
                    setValue,
                  },
                  {
                    name: "benefit_key",
                    label: "Benefit:",
                    type: "select",
                    options: benefitOptions.map((benefit) => benefit),
                    setValue,
                  },
                ],
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdateReward;
