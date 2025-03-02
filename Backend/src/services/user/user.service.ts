import { verifyUserProfileSchemaType } from "../../../../types/user";
import { UserRepository } from "../../repositories/user.repository";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRespository: UserRepository) {
    this.userRepository = userRespository;
  }

  async getUserDetails(id: string): Promise<verifyUserProfileSchemaType> {
    console.log(id);
    const user = await this.userRepository.findById(id);
    if (!user) throw new Error("User not found");
    const data = {
        email:user.email,
        avatar: user.avatar,
        firstName: user.name,
      userName: user.userName,
      gender: user.gender,
      country: user.coutry,
      description: user.description,
      mobileNumber: user.mobileNumber,
    };
    console.log(data);
    return data;
  }
}
