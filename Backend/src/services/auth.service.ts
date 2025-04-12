import bcrypt from "bcrypt";
import { LoginUser, typeRegisterUserWithOtp } from "../../../types/user";
import { config } from "dotenv";
import { Types } from "mongoose";
import {
  generateAccessToken,
  generateJWT,
  generateRefreshToken,
} from "../utils/generateJWT";
import { googleUserResponse } from "../config/googleAuth";
import { verifyCaptcha } from "../config/captchaVerify";
import { hashPassword } from "../utils/hashPassword";
import otpRepository from "../repositories/otp.repository";
import { generateOTP } from "../utils/generateOTP";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import {
  sendOtpMail,
  sendWelcomeMail,
  sendPasswordResetEmail,
  sendPasswordUpdated,
} from "../utils/email";
import {
  IUserAuthRepository,
  IUserBaseRepository,
} from "../interfaces/repositories/user.repository.interface";
import { IUser } from "../types/IUser";
import { IAuthService } from "../interfaces/services/auth.service.interface";
import { HttpStatus } from "../constants/enum.statusCode";
import { Profile } from "passport";

config();

export class AuthService implements IAuthService {
  constructor(
    private _baseRepo: IUserBaseRepository<IUser>,
    private _authRepo: IUserAuthRepository<IUser>
  ) {}

  findUserById(userId: string): Promise<any> {
    return this._baseRepo.findById(userId);
  }

  async handleGithubLogin(profile: Partial<IUser>) {
    try {
      const user = await this._authRepo.createOrUpdateFromGithub(profile);
      return user;
    } catch (error) {
      console.log(error);
      throw new Error("GitHub authentication failed");
    }
  }

  async authenticateGoogleUser(token: string) {
    try {
      const payload = await googleUserResponse(token);

      if (!payload)
        throw createHttpError(HttpStatus.NOT_FOUND, "Invalid google token");
      const isExistUserWithEmail = await this._baseRepo.findByEmail(
        payload.email
      );

      const isExistUserWithGooglId = await this._authRepo.findUserByGoogleId(
        payload.id
      );

      if (isExistUserWithEmail?.isBlocked) {
        throw createHttpError(
          HttpStatus.UNAUTHORIZED,
          "Your account were suspended"
        );
      }
      if (isExistUserWithEmail && !isExistUserWithGooglId) {
        await this._authRepo.updateUserWithGoogleId(payload.email, payload.id);
      }

      if (!isExistUserWithGooglId && !isExistUserWithEmail) {
        await this._baseRepo.create({
          googleId: payload.id,
          email: payload.email,
          firstName: payload.given_name,
          role: "user",
          avatar: payload.picture,
        });
      }

      const user = await this._authRepo.findUserByGoogleId(payload.id);

      if (!user) throw new Error("User not found with google id");
      const data = {
        userId: user._id as Types.ObjectId,
        role: user.role,
      };

      const accessToken = generateAccessToken(data);
      const refreshToken = generateRefreshToken(data);

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password, captchaToken, role }: LoginUser) {
    {
      try {
        const user = await this._baseRepo.findByEmail(email);
        if (!user || user?.role !== role)
          throw createHttpError(HttpStatus.NOT_FOUND, "Email not found");

        if (user.isBlocked) {
          if (!user.blockedUntil) {
            throw createHttpError(
              HttpStatus.UNAUTHORIZED,
              "You account has been suspended"
            );
          }
          const now = new Date();
          if (user.blockedUntil && user.blockedUntil > now) {
            throw createHttpError(
              HttpStatus.UNAUTHORIZED,
              "Account is temporarily blocked. Try again later."
            );
          } else {
            await this._authRepo.resetFailedAttempts(email);
          }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          const user = await this._authRepo.updateFailedAttempts(email);

          if (user) {
            const { failedLoginAttempts = 0 } = user;

            if (failedLoginAttempts >= 3 && failedLoginAttempts % 2 != 0) {
              throw createHttpError(HttpStatus.NOT_FOUND, "Captcha required");
            }

            if (failedLoginAttempts >= 6) {
              await this._authRepo.blockUserAfterFailedAttempt(email);
              throw createHttpError(
                HttpStatus.UNAUTHORIZED,
                "You were blocked, try after 30 minutes"
              );
            }
            throw new Error("Invalid password");
          }
        }

        if (captchaToken) {
          const captchaResponse = await verifyCaptcha(captchaToken);
          if (!captchaResponse) throw new Error("Captcha verification failed");
        }

        await this._authRepo.updateLastLogin(email);
        await this._authRepo.resetFailedAttempts(email);

        const payload = { userId: user._id as Types.ObjectId, role: user.role };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return { accessToken, refreshToken };
      } catch (error) {
        throw error;
      }
    }
  }

  async generateAccessToken(refreshToken: string) {
    try {
      const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
      const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

      if (!REFRESH_TOKEN_SECRET || !ACCESS_TOKEN_SECRET) {
        throw new Error(
          "Missing JWT ( while generating ... ) secrets in environment variables"
        );
      }

      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET as string);

      if (!decoded) throw new Error("Invalid refresh token");

      if (typeof decoded === "object" && "userId" in decoded) {
        const newAccessToken = generateAccessToken({
          userId: decoded.userId,
          role: decoded.role,
        });

        return newAccessToken;
      }
    } catch (error) {
      throw error;
    }
  }
  async forgotPassword(email: string): Promise<void> {
    try {
      const isExistUser = await this._baseRepo.findByEmail(email);
      if (!isExistUser)
        throw createHttpError(HttpStatus.NOT_FOUND, "Email not registered");

      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET, not in environment variables.");
      }
      const resetToken = jwt.sign({ userId: isExistUser._id }, JWT_SECRET, {
        expiresIn: "15m",
      });
      await this._authRepo.setPassResetToken({ email, resetToken });

      await (isExistUser.email, resetToken);
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const hashedPassword = await hashPassword(password);
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const data = {
      id: decoded?.userId,
      resetToken: token,
    };
    console.log(token, password);
    console.log(data);
    const user = await this._authRepo.findUserByRestToken(data);

    if (!user)
      throw createHttpError(HttpStatus.NOT_FOUND, "Invalid or token expired");

    await this._authRepo.updatePassword({
      email: user?.email,
      password: hashedPassword,
    });

    await sendPasswordUpdated(user?.email);
  }

  async initiateRegistration(email: string): Promise<void> {
    try {
      const isExist = await this._baseRepo.findByEmail(email);
      if (isExist)
        throw createHttpError(HttpStatus.BAD_REQUEST, "User already exisit");

      const otp = generateOTP();
      await otpRepository.deleteByEmail(email);
      const expiresAt = new Date(Date.now() + 60000);

      await otpRepository.create({ email, otp, expiresAt });

      await sendOtpMail(email, otp);
      console.log("OTP sent", otp);
    } catch (error) {
      throw error;
    }
  }

  async register({ email, password, name, otp }: typeRegisterUserWithOtp) {
    const validOtp = await otpRepository.findOtpByMail(email);

    if (!validOtp)
      throw createHttpError(
        HttpStatus.NOT_FOUND,
        "Otp is not found, Try again!"
      );

    if (validOtp?.otp != otp)
      throw createHttpError(
        HttpStatus.NOT_FOUND,
        "Otp is Incorrect, Try again!"
      );

    if (validOtp?.otp != otp || validOtp.expiresAt < new Date())
      throw createHttpError(HttpStatus.NOT_FOUND, "Otp expired, Try again!");

    await otpRepository.deleteByEmail(email);

    try {
      const hashedPassword = await hashPassword(password);

      const user = await this._baseRepo.create({
        email,
        password: hashedPassword,
        firstName: name,
      });

      await sendWelcomeMail(name, email);
      return { message: "User registered", success: true, user };
    } catch (error: any) {
      throw error;
    }
  }

 
}
