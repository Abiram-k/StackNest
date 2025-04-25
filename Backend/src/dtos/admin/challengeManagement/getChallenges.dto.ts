import { challengeResDTO } from "../../public/challenges.dto.js";

export interface GetAllChallengesDTO {
  message:string;
  success:true;
  challenges:challengeResDTO[] | null
}
