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
}
