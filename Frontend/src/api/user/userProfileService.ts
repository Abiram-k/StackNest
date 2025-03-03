import {
  axiosResponse,
  verifyUserProfileSchemaType,
} from "../../../../types/user";
import { HttpService } from "../httpService";

type verifyProfileResponse = axiosResponse & {
  userDetails: verifyUserProfileSchemaType;
};

export class UserProfileService {

  private readonly httpService: HttpService;

  constructor(httpService: HttpService) {
    this.httpService = httpService; 
  }

  async getUserProfile():Promise<verifyProfileResponse>{
    return this.httpService.get<verifyProfileResponse>("/users/details")
  }

  async updateUserProfile(data:verifyUserProfileSchemaType):Promise<axiosResponse>{
    return this.httpService.put<axiosResponse>("/users/details", data)
  }

  
}

