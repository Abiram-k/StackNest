import DetailsForm from "@/components/forms/DetailsForm";
import { Spinner } from "@/components/ui/spinner";
import { useCreateReward } from "@/hooks/admin/rewardManagement/useCreateReward";
import { useVerifyRewardForm } from "@/hooks/validation/useRewardForm";
import { ReqReward } from "@/types";
import { validateRewardSchema } from "@/validation/rewardSchema";

const benefitOptions = [
  { label: "Profile image edit", value: "profile_image_edit" },
  { label: "premium room creation", value: "premium_room_creation" },
  { label: "3 day premium access", value: "3d_premium_access" },
  { label: "Chat bot access access from profile", value: "chat_bot_access" },
  { label: "Add room to favorites", value: "add_room_favorites" },
  { label: "Fast customer support", value: "fast_customer_support" },
];

const CreateReward = () => {
  const {
    register,
    setValue,
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

  const { mutate, isPending } = useCreateReward();

  const handleAddReward = (data: ReqReward) => {
    mutate(data);
  };

  return (
    <div className="flex h-screen dark:bg-black w-full">
      {isPending && <Spinner />}
      <main className="flex-1 p-8  w-full">
        <h1 className="text-2xl font-bold mb-8 border-b pb-2">
          Add New Reward
        </h1>
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

export default CreateReward;
