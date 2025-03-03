import { verifyUserProfileSchemaType } from "../../../../types/user";
import { UserRepository } from "../../repositories/user.repository";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRespository: UserRepository) {
    this.userRepository = userRespository;
  }

  async getUserDetails(id: string): Promise<verifyUserProfileSchemaType> {
    const user = await this.userRepository.findById(id);
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
    return await this.userRepository.findByIdAndUpdate(id,data);
  }
  
}
