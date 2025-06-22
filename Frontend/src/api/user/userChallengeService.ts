import { axiosResponse, resChallengeType } from "@/types";
import { HttpService } from "../httpService";
import { USER_CHALLENGE_ROUTES } from "@/constants/apiRoutes";

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
    return this._httpService.get(USER_CHALLENGE_ROUTES.FETCH_CHALLENGES);
  }
  async getAllSubmittedChallenges(): Promise<getAllSubmittedChallengesRes> {
    return this._httpService.get(
      USER_CHALLENGE_ROUTES.GET_SUBMITTED_CHALLENGES
    );
  }

  async submitChallenge(
    challengeId: string,
    answer: string
  ): Promise<axiosResponse> {
    return this._httpService.post(
      USER_CHALLENGE_ROUTES.SUBMIT_CHALLENGE(challengeId),
      {
        answer,
      }
    );
  }
}
