import { challengeResDTO } from "../../public/challenges.dto";

export interface GetAllChallengesDTO {
  message: string;
  success: true;
  challenges: challengeResDTO[] | null;
  totalPages?: number;
}
