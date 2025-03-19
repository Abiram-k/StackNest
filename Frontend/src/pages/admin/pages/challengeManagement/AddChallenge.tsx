import DetailsForm from "@/components/forms/DetailsForm";
import { Spinner } from "@/components/ui/spinner";
import useAddChallenge from "@/hooks/admin/challengeManagement/useAddChallenge";
import { useChallengeForm } from "@/hooks/validation/useChallengeForm";
import { challegeType } from "@/types";
import { validateChallengeSchema } from "@/validation/challengeSchema";

const AddChallenge = () => {
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useChallengeForm({
    schema: validateChallengeSchema,
    defaultValues: {
      questionNo: 1,
      question: "what is js?",
      option1: "Javascript",
      option2: "Java science",
      option3: "Java simple",
      option4: "Java super",
      answer: "Javascript",
    },
  });
  const { mutate, isPending } = useAddChallenge();

  const handleAddChallenge = (data: challegeType) => {
    console.log(data);
    mutate(data);
  };

  return (
    <div className="flex h-screen dark:bg-black">
      {isPending && <Spinner />}
      <main className="flex-1 p-8  w-full">
        <h1 className="text-2xl font-bold mb-8 border-b pb-2">
          Add New Challenge
        </h1>
        <div className="w-full flex flex-col justify-between p-10 shadow-md rounded">
          <div className="md:ms-14 lg:ms-18 ">
            <DetailsForm
              isEditing={true}
              register={register}
              onSubmit={handleSubmit(handleAddChallenge)}
              errors={errors}
              submitButtonText="Submit"
              fields={[
                [
                  {
                    name: "questionNo",
                    label: "Question Number:",
                    type: "number",
                    placeholder: "Enter Question Number",
                    setValue,
                  },
                  {
                    name: "option1",
                    label: "Option 1:",
                    type: "text",
                    placeholder: "Enter Option",
                    setValue,
                  },
                  {
                    name: "option3",
                    label: "Option 3:",
                    type: "text",
                    placeholder: "Enter Option",
                    setValue,
                  },
                  {
                    name: "answer",
                    label: "Answer:",
                    type: "text",
                    placeholder: "Enter Correct Answer",
                    setValue,
                  },
                ],
                [
                  {
                    name: "question",
                    label: "Question:",
                    type: "text",
                    placeholder: "Enter Question",
                    setValue,
                  },
                  {
                    name: "option2",
                    label: "Option 2:",
                    type: "text",
                    placeholder: "Enter Option",
                    setValue,
                  },
                  {
                    name: "option4",
                    label: "Option 4:",
                    type: "text",
                    placeholder: "Enter Option",
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

export default AddChallenge;
