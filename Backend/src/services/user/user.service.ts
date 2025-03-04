import { verifyUserProfileSchemaType } from "../../../../types/user";
import { IUserBaseRepository } from "../../interfaces/user.repository.interface";
import { IUser } from "../../types/IUser";

export class UserService {
  constructor(private baseRepo: IUserBaseRepository<IUser>) {}

  async getUserDetails(id: string): Promise<verifyUserProfileSchemaType> {
    const user = await this.baseRepo.findById(id);
    if (!user) throw new Error("User not found");
    const data = {
      email: user.email,
      avatar: user.avatar,
      firstName: user.firstName,
      userName: user.userName,
      gender: user.gender,
      country: user.country,
      description: user.description,
      mobileNumber: user.mobileNumber,
    };
    return data;
  }

  async updateUserDetails(id: string, data: verifyUserProfileSchemaType) {
    console.log(data);
    const user = await this.baseRepo.findByUserName(data.userName);
    if (user && user.email != data.email)
      throw new Error("User name already exist");
    return await this.baseRepo.findByIdAndUpdate(id, data);
  }
}
