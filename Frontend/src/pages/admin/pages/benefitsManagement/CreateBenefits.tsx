import DetailsForm from "@/components/forms/DetailsForm";
import { Spinner } from "@/components/ui/spinner";
import { useCreateBenefits } from "@/hooks/admin/benefitsManagement/useCreateBenefits";
import { useVerifyBenefitForm } from "@/hooks/validation/useBenefitForm";
import { ReqBenefits } from "@/types";
import { validateBenefitSchema } from "@/validation/benefitSchema";

const CreateBenefits = () => {
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useVerifyBenefitForm({
    schema: validateBenefitSchema,
    defaultValues: {
      description: "",
      name: "",
    },
  });

  const { mutate, isPending } = useCreateBenefits(); 
  

  const handleAddBenefits = (data: ReqBenefits) => {
    mutate(data);
  };

  return (
    <div className="flex h-screen dark:bg-black w-full">
      {(isPending ) && <Spinner />}
      <main className="flex-1 p-8  w-full">
        <h1 className="text-2xl font-bold mb-8 border-b pb-2">
          Add New Benefit
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
                    type: "text",
                    placeholder: "Enter name ",
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

export default CreateBenefits;
