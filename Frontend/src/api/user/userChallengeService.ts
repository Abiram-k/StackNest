import { axiosResponse, resChallengeType } from "@/types";
import { HttpService } from "../httpService";

type getAllChallengesRes = axiosResponse & {
  challenges: resChallengeType[] | null;
};
type getAllSubmittedChallengesRes = axiosResponse & {
  submittedChallenges: {
    answer: string;
    challengeId: string;
    isSubmitted: boolean;
    _id: string;
    submittedAt: Date;
  }[];
};

export class UserChallengeService {
  private readonly _httpService: HttpService;
  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }

  async fetchChallenges(): Promise<getAllChallengesRes> {
    return this._httpService.get("/users/challenge");
  }
  async getAllSubmittedChallenges(): Promise<getAllSubmittedChallengesRes> {
    return this._httpService.get("/users/submitted-challenges");
  }

  async submitChallenge(
    challengeId: string,
    answer: string
  ): Promise<axiosResponse> {
    return this._httpService.post(`/users/challenge/${challengeId}`, {
      answer,
    });
  }
}
