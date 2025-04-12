import { ReqReport } from "@/types";
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

type GetUserInspectReponse = axiosResponse & {
  userData: {
    userName: string;
    avatar: string;
    description: string;
    connectionCount: number;
    feedsCount: number;
    streakCount: number;
  };
  feedData: {
    feedId: string;
    title: string;
    content: string;
    media?: string;
    likesCount: number;
    commentsCount: number;
    viewsCount: number;
    uploadedAt: string;
  }[];
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
type ResGetFriendSuggestion = axiosResponse & {
  usersData: {
    avatar: string;
    userName: string;
    firstName: string;
    description: string;
  }[];
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

  async getInspectData(userName: string): Promise<GetUserInspectReponse> {
    return this._httpService.get(`/users/${userName}/inspect`);
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

  async getFriendSuggestion(): Promise<ResGetFriendSuggestion> {
    return this._httpService.get("/users/friends/suggestion");
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

  async report(data: ReqReport): Promise<axiosResponse> {
    return await this._httpService.post("/users/report", data);
  }
}
