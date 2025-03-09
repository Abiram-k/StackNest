import { IOTP } from "../types/IOtp";
import Otp from "../models/otp.model";

class OtpRepository {


  async findOtpByMail(email: string): Promise<IOTP | null> {
    try {
      return await Otp.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  async deleteByEmail(email: string): Promise<void> {
    try {
      await Otp.deleteMany({ email });
    } catch (error) {
      throw error;
    }
  }
  
  async create({ email, otp, expiresAt }: IOTP): Promise<void> {
    try {
      await Otp.create({
        email,
        otp,
        expiresAt,
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new OtpRepository();
