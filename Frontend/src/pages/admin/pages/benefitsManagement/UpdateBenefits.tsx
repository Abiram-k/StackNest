import DetailsForm from "@/components/forms/DetailsForm";
import { Spinner } from "@/components/ui/spinner";
import { useGetSelectedBenefits } from "@/hooks/admin/benefitsManagement/useGetSelectedBenefits";
import { useUpdateBenefits } from "@/hooks/admin/benefitsManagement/useUpdateBenefits";
import { useVerifyBenefitForm } from "@/hooks/validation/useBenefitForm";
import { ReqBenefits } from "@/types";
import { validateBenefitSchema } from "@/validation/benefitSchema";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const benefitOptions = [
  { label: "Premium_badge", value: "premium_badge" },
  { label: "Profile image edit", value: "profile_image_edit" },
  { label: "premium room creation", value: "premium_room_creation" },
  { label: "Chat bot access access from profile", value: "chat_bot_access" },
  { label: "Unlimited room creation", value: "unlimited_room_creation" },
  { label: "Add room to favorites", value: "add_room_favorites" },
  { label: "Fast customer support", value: "fast_customer_support" },
];

const UpdateBenefits = () => {
  const {
    register,
    setValue,
    reset,
    formState: { errors },
    handleSubmit,
  } = useVerifyBenefitForm({
    schema: validateBenefitSchema,
    defaultValues: {
      description: "",
      name: "",
    },
  });
  const navigate = useNavigate();
  const { benefitId } = useParams<{ benefitId: string }>();
  if (!benefitId) {
    toast.warning("Benefit id not founded");
    navigate(-1);
  }

  const { data: benefitData, isPending: fetchPending } = useGetSelectedBenefits(
    benefitId!
  );

  const { mutate: updateMutate, isPending: updatePending } =
    useUpdateBenefits();

  useEffect(() => {
    reset(benefitData?.benefit);
  }, [benefitData?.benefit]);

  const handleAddBenefits = (data: ReqBenefits) => {
    updateMutate({ benefitId: benefitId!, data });
  };

  return (
    <div className="flex h-screen dark:bg-black w-full">
      {(fetchPending || updatePending) && <Spinner />}
      <main className="flex-1 p-8  w-full">
        <h1 className="text-2xl font-bold mb-8 border-b pb-2">
          Update Benefit
        </h1>
        <div className="w-full flex flex-col justify-between p-10  rounded">
          <div className="md:ms-14 lg:ms-32 w-full">
            <DetailsForm
              isEditing={true}
              register={register}
              onSubmit={handleSubmit(handleAddBenefits)}
              errors={errors}
              submitButtonText="Submit"
              fields={[
                [
                  {
                    name: "name",
                    label: "Name:",
                    type: "select",
                    options: benefitOptions.map((benefit) => benefit),
                    setValue,
                  },
                  {
                    name: "description",
                    label: "Description:",
                    type: "textarea",
                    placeholder: "Enter Description ",
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

export default UpdateBenefits;
