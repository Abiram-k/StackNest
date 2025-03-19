import { challengeResDTO } from "../../dtos/public/challenges.dto";

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

  getAllChallenges():Promise<challengeResDTO[] | null>
}
