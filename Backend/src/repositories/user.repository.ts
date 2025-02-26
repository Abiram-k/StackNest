import { IOTP } from "../interfaces/IOtp";
import Otp from "../models/otp.model";
import User from "../models/user.model";

class UserRepository {
 
  async findUserByGoogleId(googleId: string) {
    try {
      return await User.findOne({
        googleId,
      });
    } catch (error) {
      throw error;
    }
  }
  async findOneByEmail(email: string) {
    try {
      return await User.findOne({
        email,
      });
    } catch (error) {
      throw error;
    }
  }

  async create(userData: any) {
    try {
      return await User.create(userData);
    } catch (error) {
      throw error;
    }
  }
}

export default new UserRepository();
