import { axiosResponse, challegeType, resChallengeType } from "@/types";
import { HttpService } from "../httpService";

type getAllChallengesRes = axiosResponse & {
  challenges: resChallengeType[] | null;
};

export class ChallengeService {
  private readonly _httpService: HttpService;
  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }

  async addNewChallenge(data: challegeType): Promise<axiosResponse> {
    return this._httpService.post("/admin/challenge", data);
  }

  async getAllChallenges(): Promise<getAllChallengesRes> {
    return this._httpService.get("/admin/challenge");
  }
}
