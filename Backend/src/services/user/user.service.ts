import bcrypt from "bcrypt";
import userRepository from "../../repositories/user.repository";
import { LoginUser, typeRegisterUserWithOtp } from "../../../../types/user";
import { config } from "dotenv";
import { Types } from "mongoose";
import {
  generateAccessToken,
  generateJWT,
  generateRefreshToken,
} from "../../utils/generateJWT";
import { googleUserResponse } from "../../config/googleAuth";
import { verifyCaptcha } from "../../config/captchaVerify";
import { hashPassword } from "../../utils/hashPassword";
import otpRepository from "../../repositories/otp.repository";
import { generateOTP } from "../../utils/generateOTP";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import {
  sendOtpMail,
  sendWelcomeMail,
  sendPasswordResetEmail,
  sendPasswordUpdated,
} from "../../utils/email";
import { IUser } from "../../types/IUser";

config();

class AuthService {
  async authenticateGoogleUser(token: string) {
    try {
      const payload = await googleUserResponse(token);

      if (!payload) throw createHttpError(404, "Invalid google token");
      const isExistUser = await userRepository.findByEmail(payload.email);
      if (isExistUser) {
        await userRepository.updateUserWithGoogleId(payload.email, payload.id);
      }
      const user = await userRepository.findUserByGoogleId(payload.id);

      if (!user && !isExistUser) {
        const newUser = await userRepository.create({
          googleId: payload.id,
          email: payload.email,
          name: payload.given_name,
          role: "user",
          avatar: payload.picture,
        });

        const data = {
          userId: newUser._id as Types.ObjectId,
          role: newUser.role,
        };
        const accessToken = generateAccessToken(data);
        const refreshToken = generateRefreshToken(data);

        return { accessToken, refreshToken };
      }
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password, captchaToken }: LoginUser) {
    {
      try {
        // console.log(email, password, captchaToken )
        const user = await userRepository.findByEmail(email);
        if (!user || user.role == "admin")
          throw createHttpError(401, "Email not found");

        if (user.isBlocked) {
          const now = new Date();
          if (user.blockedUntil && user.blockedUntil > now) {
            throw createHttpError(
              403,
              "Account is temporarily blocked. Try again later."
            );
          } else {
            await userRepository.resetFailedAttempts(email);
          }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          const user = await userRepository.updateFailedAttempts(email);

          if (user) {
            const { failedLoginAttempts = 0 } = user;

            if (failedLoginAttempts >= 3 && failedLoginAttempts % 2 != 0) {
              throw createHttpError(404, "Captcha required");
            }

            if (failedLoginAttempts >= 6) {
              await userRepository.blockUserAfterFailedAttempt(email);
              throw createHttpError(
                403,
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

        await userRepository.updateLastLogin(email);
        await userRepository.resetFailedAttempts(email);

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
      console.log(decoded);
      if (!decoded) throw new Error("Invalid refresh token");
      if (typeof decoded === "object" && "userId" in decoded) {
        const newAccessToken = generateAccessToken({
          userId: decoded.userId,
          role: decoded.role,
        });
        // console.log("NEW TOKEN: ",newAccessToken)
        return newAccessToken;
      }
    } catch (error) {
      throw error;
    }
  }
  async forgotPassword(email: string): Promise<void> {
    try {
      const isExistUser = await userRepository.findByEmail(email);
      if (!isExistUser) throw createHttpError(404, "Email not registered");

      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET, not in environment variables.");
      }
      const resetToken = jwt.sign({ userId: isExistUser._id }, JWT_SECRET, {
        expiresIn: "15m",
      });
      await userRepository.setPassResetToken({ email, resetToken });

      await sendPasswordResetEmail(isExistUser.email, resetToken);
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
    const user = await userRepository.findUserByRestToken(data);

    if (!user) throw createHttpError(404, "Invalid or token expired");

    await userRepository.updatePassword({
      email: user?.email,
      password: hashedPassword,
    });

    await sendPasswordUpdated(user?.email);
  }

  async initiateRegistration(email: string): Promise<void> {
    try {
      const isExist = await userRepository.findByEmail(email);
      if (isExist) throw createHttpError(400, "User already exisit");

      const otp = generateOTP();
      await otpRepository.deleteByEmail(email);
      const expiresAt = new Date(Date.now() + 15 * 60000);

      await otpRepository.create({ email, otp, expiresAt });

      await sendOtpMail(email, otp);
      console.log("OTP sent", otp);
    } catch (error) {
      throw error;
    }
  }
  async register({ email, password, name, otp }: typeRegisterUserWithOtp) {
    const validOtp = await otpRepository.findOtpByMail(email);

    console.log("orgOTP: ", validOtp?.otp, validOtp?.expiresAt, "otp: ", otp);
    if (!validOtp || validOtp?.otp != otp || validOtp.expiresAt < new Date())
      throw createHttpError(404, "Otp expired, Try again!");

    await otpRepository.deleteByEmail(email);
    try {
      const hashedPassword = await hashPassword(password);

      const user = await userRepository.create({
        email,
        password: hashedPassword,
        name,
      });

      await sendWelcomeMail(name, email);
      // await transporter.sendMail(welcomeMailOptions);
      return { success: true, user };
    } catch (error: any) {
      throw error;
    }
  }

  async getUserDetails(id: string) {
    const user = await userRepository.findById(id);

    if (!user) throw new Error("User not found");

    return user;
  }
}

export default new AuthService();
