import { FallBackTable } from "@/components/FallBackTable";
import SuccessModal from "@/components/modal/SuccessModal";
import { Spinner } from "@/components/ui/spinner";
import { useFetchAllSubmittedChallenges } from "@/hooks/user/challenge/useFetchAllSubmittedChallenges";
import { useFetchChallenges } from "@/hooks/user/challenge/useFetchChallenge";
import { useSubmitChallenge } from "@/hooks/user/challenge/useSubmitChallenge";
import { useFetchChallengePoints } from "@/hooks/user/userProfile/useFetchChallengePoints";
import { CheckCircle, Code } from "lucide-react";
import { useState } from "react";

export default function DailyChallengePage() {
  const [selectedOption, setSelectedOption] = useState("");
  const [isSelectedOptionCorrect, setIsSelectedOptionCorrect] = useState(false);
  const { data, isPending } = useFetchChallenges();

  const { mutate: submitMutate, isPending: submitPending } =
    useSubmitChallenge();

  const { data: challengePoints, isPending: ischallengePointPending } =
    useFetchChallengePoints();

  const { data: submittedChallenges, isPending: submittedChallengePending } =
    useFetchAllSubmittedChallenges();

  console.log("Submitted Challenge: ", submittedChallenges);

  const handleSubmit = (challengeId: string) => {
    submitMutate(
      { challengeId, answer: selectedOption },
      {
        onSuccess: (data) => {
          if (data.success) setIsSelectedOptionCorrect(true);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {(submitPending ||
        isPending ||
        ischallengePointPending ||
        submittedChallengePending) && <Spinner />}
      {isSelectedOptionCorrect && (
        <SuccessModal
          title="You choose correct one!"
          message="You got one more point, use this point to unlock exciting features"
          onClose={() => {
            setIsSelectedOptionCorrect(false);
          }}
          isOpen={isSelectedOptionCorrect}
        />
      )}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-10 h-10 mr-3">
              <QuizIcon />
            </div>
            <h1 className="text-2xl font-bold">Daily Challenge</h1>
          </div>
          <div className="bg-amber-100 rounded-lg p-4 flex items-center">
            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
              <span className="text-xs">$</span>
            </div>
            <div>
              <p className="font-bold dark:text-black">
                {challengePoints?.pointsCount ?? 9999} Points
              </p>
              <p className="text-xs text-gray-600 max-w-xs">
                You can earn points by completing quizzes, using the
                leaderboard, and redeem your points for exclusive benefits and
                rewards.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.challenges?.length ? (
            data.challenges
              .filter((challenge) => challenge.isListed)
              ?.map((challenge) => {
                const submittedChallenge =
                  submittedChallenges?.submittedChallenges.find(
                    (submitted) => submitted.challengeId === challenge._id
                  );
                return (
                  <div key={challenge._id} className="flex flex-col mb-10">
                    <div className="bg-purple-400 rounded-lg h-32 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-purple-300 rounded-full w-40 h-40 absolute"></div>
                        <div className="bg-purple-200 rounded-full w-24 h-24 absolute"></div>
                      </div>
                      <div className="z-10 bg-white rounded-full p-3">
                        <Code className="text-blue-500" />
                      </div>
                      {submittedChallenge?.isSubmitted ? (
                        <CheckCircle className="absolute text-green-600 right-10 top-5" />
                      ) : (
                        // <XCircle className="absolute text-red-600 right-10 top-5" />
                        <></>
                      )}
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm border mt-4 mb-4 dark:bg-gray-900">
                      <h3 className="dark:text-white text-center  ">
                        {challenge.question}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {challenge.options.map((option, index) => (
                        <button
                          key={index}
                          className={`p-3 rounded-lg border text-left hover:border-purple-400 ${
                            submittedChallenge
                              ? (submittedChallenge?.answer == option &&
                                  submittedChallenge.isSubmitted &&
                                  "border-green-500 bg-purple-50 dark:bg-gray-900") ||
                                (submittedChallenge.answer == option &&
                                  !submittedChallenge.isSubmitted &&
                                  "border-red-500 bg-purple-50 dark:bg-gray-900")
                              : option === selectedOption
                              ? "border-purple-500 bg-purple-50 dark:bg-gray-900"
                              : "border-gray-200"
                          }`}
                          onClick={() => setSelectedOption(option)}
                        >
                          <span className="">
                            {index + 1}. {option}{" "}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-center">
                      <button
                        className="bg-purple-500 text-white px-8 py-2 rounded-full hover:bg-purple-600 transition-colors"
                        onClick={() => handleSubmit(challenge._id)}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                );
              })
          ) : (
            <FallBackTable
              mainTitle="No Challenges founded"
              subTitle="You will notify once updated"
            />
          )}
        </div>
      </main>
    </div>
  );
}

const QuizIcon = () => (
  <div className="border border-gray-300 w-full h-full grid grid-cols-2 grid-rows-2">
    <div className="border-r border-b border-gray-300 flex items-center justify-center">
      Q
    </div>
    <div className="border-b border-gray-300 flex items-center justify-center">
      U
    </div>
    <div className="border-r border-gray-300 flex items-center justify-center">
      I
    </div>
    <div className="flex items-center justify-center">Z</div>
  </div>
);
