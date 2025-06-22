import { axiosResponse, ReqReport, verifyUserProfileSchemaType } from "@/types";

import { HttpService } from "../httpService";
import { USER_PROFILE_ROUTES } from "@/constants/apiRoutes";

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
  isAlreadyInConnection: boolean;
  userData: {
    id: string;
    userName: string;
    avatar: string;
    description: string;
    connectionCount: number;
    feedsCount: number;
    streakCount: number;
    isVerified: boolean;
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
    isVerified: boolean;
  }[];
};

export class UserProfileService {
  private readonly _httpService: HttpService;

  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }

  async getOpenAiResponse(prompt: string): Promise<openaiResponse> {
    return this._httpService.post(USER_PROFILE_ROUTES.GET_OPENAI_RESPONSE, {
      prompt,
    });
  }
  async getUserProfile(): Promise<verifyProfileResponse> {
    return this._httpService.get<verifyProfileResponse>(
      USER_PROFILE_ROUTES.GET_USER_PROFILE
    );
  }

  async getInspectData(userName: string): Promise<GetUserInspectReponse> {
    return this._httpService.get(
      USER_PROFILE_ROUTES.GET_INSPECT_DATA(userName)
    );
  }

  async updateUserProfile(
    data: verifyUserProfileSchemaType
  ): Promise<axiosResponse> {
    return this._httpService.put<axiosResponse>(
      USER_PROFILE_ROUTES.UPDATE_USER_PROFILE,
      data
    );
  }

  async checkin(): Promise<axiosResponse> {
    return this._httpService.patch<axiosResponse>(USER_PROFILE_ROUTES.CHECKIN);
  }

  async getStreakCount(): Promise<axiosResponse & { streakCount: number }> {
    return this._httpService.get<axiosResponse & { streakCount: number }>(
      USER_PROFILE_ROUTES.GET_STREAK_COUNT
    );
  }

  async getFriendSuggestion(): Promise<ResGetFriendSuggestion> {
    return this._httpService.get(USER_PROFILE_ROUTES.GET_FRIEND_SUGGESTION);
  }

  async getStatsLeaderboardData(): Promise<ResgetStatsData> {
    return this._httpService.get(USER_PROFILE_ROUTES.GET_STATS_LEADERBOARD);
  }

  async getUserCardDetails(): Promise<GetUserCardDataReponse> {
    return this._httpService.get(USER_PROFILE_ROUTES.GET_USER_CARD_DATA);
  }

  async fetchChallengePoints(): Promise<
    axiosResponse & { pointsCount: number }
  > {
    return this._httpService.get<axiosResponse & { pointsCount: number }>(
      USER_PROFILE_ROUTES.FETCH_CHALLENGE_POINTS
    );
  }

  async report(data: ReqReport): Promise<axiosResponse> {
    return await this._httpService.post(USER_PROFILE_ROUTES.REPORT, data);
  }
}
