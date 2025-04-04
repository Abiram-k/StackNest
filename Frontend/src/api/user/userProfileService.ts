import {
  axiosResponse,
  verifyUserProfileSchemaType,
} from "../../../../types/user";
import { HttpService } from "../httpService";

type verifyProfileResponse = axiosResponse & {
  userDetails: verifyUserProfileSchemaType;
};

type openaiResponse = axiosResponse & {
  response: string;
};
type GetUserCardDataReponse = axiosResponse & {
  data: {
    userName: string;
    description: string;
    avatarUrl: string;
    friendsCount: number;
    feedsCount: number;
  };
};
interface IUserTableData {
  userName: string;
  avatar: string;
  count: number;
}

type ResgetStatsData = axiosResponse & {
  user: {
    streakCount: number;
    points: number;
  };
  streakTableData: IUserTableData[];
  pointsTableData: IUserTableData[];
};

export class UserProfileService {
  private readonly _httpService: HttpService;

  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }

  async getOpenAiResponse(prompt: string): Promise<openaiResponse> {
    return this._httpService.post("/users/chatbot", { prompt });
  }
  async getUserProfile(): Promise<verifyProfileResponse> {
    return this._httpService.get<verifyProfileResponse>("/users/details");
  }

  async updateUserProfile(
    data: verifyUserProfileSchemaType
  ): Promise<axiosResponse> {
    return this._httpService.put<axiosResponse>("/users/details", data);
  }

  async checkin(): Promise<axiosResponse> {
    return this._httpService.patch<axiosResponse>("/users/checkin");
  }

  async getStreakCount(): Promise<axiosResponse & { streakCount: number }> {
    return this._httpService.get<axiosResponse & { streakCount: number }>(
      "/users/streak"
    );
  }

  async getStatsLeaderboardData(): Promise<ResgetStatsData> {
    return this._httpService.get("/users/stats");
  }

  async getUserCardDetails(): Promise<GetUserCardDataReponse> {
    return this._httpService.get("/users/card/data");
  }

  async fetchChallengePoints(): Promise<
    axiosResponse & { pointsCount: number }
  > {
    return this._httpService.get<axiosResponse & { pointsCount: number }>(
      "users/challenge-points"
    );
  }
}
