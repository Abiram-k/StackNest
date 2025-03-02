import { Types } from "mongoose";
import bcrypt from "bcrypt";
import { LoginUser } from "../../../../types/user";
import { UserRepository } from "../../repositories/user.repository";
import createHttpError from "http-errors";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateJWT";

export class AdminService {
  private adminRepository: UserRepository;

  constructor(adminRepository: UserRepository) {
    this.adminRepository = adminRepository;
  }

  async login({ email, password }: LoginUser) {
    {
      try {
        const user = await this.adminRepository.findByEmail(email);

        if (!user || user.role == "user")
          throw createHttpError(404, "Email not found");

        if (user.isBlocked) {
          const now = new Date();
          if (user.blockedUntil && user.blockedUntil > now) {
            throw createHttpError(
              403,
              "Account is temporarily blocked!. Try again later."
            );
          } else {
            await this.adminRepository.resetFailedAttempts(email);
          }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          const user = await this.adminRepository.updateFailedAttempts(email);

          if (user) {
            const { failedLoginAttempts = 0 } = user;

            if (failedLoginAttempts >= 5) {
              await this.adminRepository.blockUserAfterFailedAttempt(email);
              throw createHttpError(
                403,
                "You were blocked, try after 30 minutes"
              );
            }
            throw createHttpError(404, "Invalid password");
          }
        }

        await this.adminRepository.updateLastLogin(email);
        await this.adminRepository.resetFailedAttempts(email);

        const payload = { userId: user._id as Types.ObjectId, role: user.role };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return { accessToken, refreshToken };
      } catch (error) {
        throw error;
      }
    }
  }
}
