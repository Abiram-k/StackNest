import { verifyUserProfileSchemaType } from "../../../../types/user";
import { IUser } from "../../types/IUser";

export interface IUserProfileService {
  getUserDetails(id: string): Promise<verifyUserProfileSchemaType>;
  updateUserDetails(
    id: string,
    data: verifyUserProfileSchemaType
  ): Promise<IUser | null>;
  checkinUser(userId:string):Promise<void>
  getUserStreakCount(userId:string):Promise<number | null>
  getUserChallengePoints(userId:string):Promise<number | null>
}
