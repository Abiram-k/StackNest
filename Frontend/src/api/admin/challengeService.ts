import { axiosResponse, challegeType, resChallengeType } from "@/types";
import { HttpService } from "../httpService";
import { ADMIN_CHALLENGE_ROUTES } from "@/constants/apiRoutes";

type getAllChallengesRes = axiosResponse & {
  challenges: resChallengeType[] | null;
  totalPages: number;
};

export class ChallengeService {
  private readonly _httpService: HttpService;
  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }

  async addNewChallenge(data: challegeType): Promise<axiosResponse> {
    return this._httpService.post(ADMIN_CHALLENGE_ROUTES.ADD, data);
  }

  async getAllChallenges(
    currentPage?: number,
    limit = 5
  ): Promise<getAllChallengesRes> {
    return this._httpService.get(
      ADMIN_CHALLENGE_ROUTES.GET_ALL(limit, currentPage)
    );
  }

  async updateChallenge(
    challengeId: string,
    data: challegeType
  ): Promise<axiosResponse> {
    return this._httpService.put(
      ADMIN_CHALLENGE_ROUTES.UPDATE(challengeId),
      data
    );
  }

  async removeChallenge(challengeId: string): Promise<axiosResponse> {
    return this._httpService.delete(ADMIN_CHALLENGE_ROUTES.DELETE(challengeId));
  }

  async toggleListing(challengeId: string): Promise<axiosResponse> {
    return this._httpService.patch(ADMIN_CHALLENGE_ROUTES.TOGGLE(challengeId));
  }
}
