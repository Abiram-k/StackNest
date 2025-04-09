import DetailsForm from "@/components/forms/DetailsForm";
import { Spinner } from "@/components/ui/spinner";
import { useGetActiveBenefits } from "@/hooks/admin/benefitsManagement/useGetActiveBenefits";
import { useGetSelectedPremium } from "@/hooks/admin/premiumManagment/useGetSelectedPremium";
import { useUpdatePremium } from "@/hooks/admin/premiumManagment/useUpdatePremium";
import { usePremiumForm } from "@/hooks/validation/usePremiumForm";
import { PremiumFormType, ReqPremium } from "@/types";
import { validatePremiumSchema } from "@/validation/premiumSchema";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const UpdatePremium = () => {
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    reset,
  } = usePremiumForm({
    schema: validatePremiumSchema,
    defaultValues: {
      title: "",
      description: "",
      regularAmount: 0,
      discountAmount: 0,
      benefit1: "",
      benefit2: "",
      benefit3: "",
      benefit4: "",
      benefit5: "",
      periodInDays: 0,
    },
  });
  const { premiumId } = useParams<{ premiumId: string }>();
  const { mutate: updateMutate, isPending: updateIsPending } =
    useUpdatePremium();
  const { data: selectedData, isPending: fetchingData } = useGetSelectedPremium(
    premiumId!
  );
  const { data: activeBenefits, isPending: fetchingBenefits } =
    useGetActiveBenefits();

  useEffect(() => {
    if (!selectedData?.premiumPlan) return;

    const {
      title,
      description,
      regularAmount,
      discountAmount,
      periodInDays,
      willExpireInDays,
    } = selectedData.premiumPlan;
    reset({
      title,
      description,
      regularAmount,
      discountAmount,
      periodInDays,
      willExpireInDays,
    });

    selectedData.premiumPlan?.benefits?.forEach((benefit, index) => {
      if (index < 6) {
        const fieldKey = `benefit${index + 1}` as keyof PremiumFormType;
        setValue(fieldKey, benefit);
      }
    });
  }, [selectedData?.premiumPlan]);

  const handleUpdatePremiumPlan = (data: PremiumFormType) => {
    const formattedData: ReqPremium = {
      title: data.title,
      description: data.description,
      regularAmount: data.regularAmount,
      discountAmount: data.discountAmount,
      periodInDays: data.periodInDays,
      willExpireInDays: Number(data.willExpireInDays),
      benefits: [
        data.benefit1,
        data.benefit2,
        data.benefit3,
        data.benefit4,
        data.benefit5,
        data.benefit6,
      ].filter((b) => b?.trim() && b != "Nill"),
    };
    updateMutate({ premiumId: premiumId!, data: formattedData });
  };
  return (
    <div className="flex h-screen dark:bg-black">
      {(updateIsPending || fetchingBenefits || fetchingData) && <Spinner />}
      <main className="flex-1 p-8  w-full">
        <h1 className="text-2xl font-bold mb-8 border-b pb-2">
          Update Premium Plan
        </h1>
        <div className="w-full flex flex-col justify-between p-10 shadow-md rounded">
          <div className="md:ms-14 lg:ms-18 ">
            <DetailsForm
              isEditing={true}
              register={register}
              onSubmit={handleSubmit(handleUpdatePremiumPlan)}
              errors={errors}
              submitButtonText="Submit"
              fields={[
                [
                  {
                    name: "title",
                    label: "Title:",
                    type: "text",
                    placeholder: "Enter Question Number",
                    setValue,
                  },
                  {
                    name: "regularAmount",
                    label: "Regular Amount:",
                    type: "text",
                    placeholder: "Enter Regular Amount",
                    setValue,
                  },
                  {
                    name: "benefit1",
                    label: "Benefit 1:",
                    type: "select",
                    options: [
                      { value: "Nill", label: "Nill" },
                      ...(activeBenefits?.benefits.map((benefit) => ({
                        value: benefit.name,
                        label: benefit.name,
                      })) || []),
                    ],
                    defaultValue: selectedData?.premiumPlan?.benefits[0],
                    setValue,
                  },
                  {
                    name: "benefit3",
                    label: "Benefit 3:",
                    type: "select",
                    options: [
                      { value: "Nill", label: "Nill" },
                      ...(activeBenefits?.benefits.map((benefit) => ({
                        value: benefit.name,
                        label: benefit.name,
                      })) || []),
                    ],
                    defaultValue: selectedData?.premiumPlan?.benefits[1],
                    setValue,
                  },
                  {
                    name: "benefit5",
                    label: "Benefit 5:",
                    type: "select",
                    options: [
                      { value: "Nill", label: "Nill" },
                      ...(activeBenefits?.benefits.map((benefit) => ({
                        value: benefit.name,
                        label: benefit.name,
                      })) || []),
                    ],
                    defaultValue: selectedData?.premiumPlan?.benefits[2],
                    setValue,
                  },

                  {
                    name: "periodInDays",
                    label: "Plan duration: ",
                    type: "number",
                    placeholder: "Enter Period (days) ...",
                    setValue,
                  },
                ],
                [
                  {
                    name: "description",
                    label: "Description",
                    type: "text",
                    placeholder: "Enter Description ...",
                    setValue,
                  },
                  {
                    name: "discountAmount",
                    label: "Discount Amount:",
                    type: "text",
                    placeholder: "Enter Discount Amount",
                    setValue,
                  },
                  {
                    name: "benefit2",
                    label: "Benefit 2:",
                    type: "select",
                    options: [
                      { value: "Nill", label: "Nill" },
                      ...(activeBenefits?.benefits.map((benefit) => ({
                        value: benefit.name,
                        label: benefit.name,
                      })) || []),
                    ],
                    defaultValue: selectedData?.premiumPlan?.benefits[3],
                    setValue,
                  },
                  {
                    name: "benefit4",
                    label: "Benefit 4:",
                    type: "select",
                    options: [
                      { value: "Nill", label: "Nill" },
                      ...(activeBenefits?.benefits.map((benefit) => ({
                        value: benefit.name,
                        label: benefit.name,
                      })) || []),
                    ],
                    defaultValue: selectedData?.premiumPlan?.benefits[4],
                    setValue,
                  },

                  {
                    name: "benefit6",
                    label: "Benefit 6:",
                    type: "select",
                    options: [
                      { value: "Nill", label: "Nill" },
                      ...(activeBenefits?.benefits.map((benefit) => ({
                        value: benefit.name,
                        label: benefit.name,
                      })) || []),
                    ],
                    defaultValue: selectedData?.premiumPlan?.benefits[5],
                    setValue,
                  },
                  {
                    name: "willExpireInDays",
                    label: "List premium for : ",
                    type: "number",
                    placeholder: "Enter Expiry in (days) ...",
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

export default UpdatePremium;
