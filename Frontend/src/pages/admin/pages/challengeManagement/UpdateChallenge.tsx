import DetailsForm from "@/components/forms/DetailsForm";
import { Spinner } from "@/components/ui/spinner";
import { useGetAllChallenges } from "@/hooks/admin/challengeManagement/useGetAllChallenges";
import { useUpdateChallenge } from "@/hooks/admin/challengeManagement/useUpdateChallenge";
import { useChallengeForm } from "@/hooks/validation/useChallengeForm";
import { challegeType, resChallengeType } from "@/types";
import { validateChallengeSchema } from "@/validation/challengeSchema";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const UpdateChallenge = () => {
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useChallengeForm({
    schema: validateChallengeSchema,
    defaultValues: {
      questionNo: 0,
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      answer: "",
    },
  });
  const { challengeId } = useParams<{ challengeId: string }>();
  if (!challengeId) {
    toast.dismiss();
    toast.error("Id not founded");
    return;
  }
  const { mutate: updateMutate, isPending: updatePending } =
    useUpdateChallenge();

  const { data: allChallenges, isPending: fetchingChallengePending } =
    useGetAllChallenges({});

  useEffect(() => {
    if (allChallenges && challengeId) {
      const selectedChallenge = allChallenges?.challenges?.find(
        (challenge: resChallengeType) => challenge._id === challengeId
      );

      if (selectedChallenge) {
        setValue("questionNo", selectedChallenge.questionNo);
        setValue("question", selectedChallenge.question);
        setValue("option1", selectedChallenge.options[0] || "");
        setValue("option2", selectedChallenge.options[1] || "");
        setValue("option3", selectedChallenge.options[2] || "");
        setValue("option4", selectedChallenge.options[3] || "");
        setValue("answer", selectedChallenge.answer);
      }
    }
  }, [allChallenges, challengeId, setValue]);

  const handleUpdateChallenge = (data: challegeType) => {
    updateMutate({ challengeId, data });
  };

  return (
    <div className="flex h-screen dark:bg-black">
      {(updatePending || fetchingChallengePending) && <Spinner />}
      <main className="flex-1 p-8  w-full">
        <h1 className="text-2xl font-bold mb-8 border-b pb-2">
          Edit Challenge
        </h1>
        <div className="w-full flex flex-col justify-between p-10 shadow-md rounded">
          <div className="md:ms-14 lg:ms-18 ">
            <DetailsForm
              isEditing={true}
              register={register}
              onSubmit={handleSubmit(handleUpdateChallenge)}
              errors={errors}
              submitButtonText="Update"
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

export default UpdateChallenge;
