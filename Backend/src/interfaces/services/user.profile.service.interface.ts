import { verifyUserProfileSchemaType } from "../../../../types/user";
import { IUser } from "../../types/IUser";

export interface IUserProfileService {
  getUserDetails(id: string): Promise<verifyUserProfileSchemaType>;
  updateUserDetails(
    id: string,
    data: verifyUserProfileSchemaType
  ): Promise<IUser | null>;
}
