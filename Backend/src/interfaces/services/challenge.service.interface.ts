import { UpdateChallengeDTO } from "../../dtos/admin/challengeManagement/updateChallenge.dto";
import { challengeResDTO } from "../../dtos/public/challenges.dto";
import { IChallengeSubmission } from "../../types/IChallengeSubmissionSchema";

export interface IChallengeService {
  addNewChallenge(data: {
    answer: string;
    option4: string;
    option3: string;
    option2: string;
    option1: string;
    question: string;
    questionNo: number;
  }): Promise<boolean>;
  submitChallenge(userId:string,challengeId: string, answer: string): Promise<boolean>;
  getAllChallenges(): Promise<challengeResDTO[] | null>;
  updateChallenge(challengeId: string, data: UpdateChallengeDTO): Promise<void>;
  toggleListing(challengeId: string): Promise<void>;
  removeChallenge(challengeId: string): Promise<void>;
  getUserSubmittedChallenges(userId:string):Promise<Partial<IChallengeSubmission>[] | null >;
}
