import bcrypt from "bcrypt";
import userRepository from "../repositories/user.repository";
import {
  LoginUser,
  RegisterUser,
  typeRegisterUserWithOtp,
} from "../../../types/user";
import axios from "axios";
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
import nodemailer from "nodemailer";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendPasswordResetEmail } from "../utils/email";
config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
class AuthService {
  async authenticateGoogleUser(token: string) {
    const payload = await googleUserResponse(token);

    if (!payload) throw new Error("Invalid google token");
    const isExistUser = await userRepository.findOneByEmail(payload.email);
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

      const token = generateJWT({
        // email: newUser.email,
        userId: newUser._id as Types.ObjectId,
        role: newUser.role,
      });

      return { token };
    }
  }

  async login({ email, password, captchaToken }: LoginUser) {
    {
      try {
        const user = await userRepository.findOneByEmail(email);
        if (!user) throw new Error("User not found");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          const user = await userRepository.updateFailedAttempts(email);

          if (user) {
            const { failedLoginAttempts = 0 } = user;

            if (failedLoginAttempts >= 3 && failedLoginAttempts % 3 == 0) {
              throw new Error("Captcha required");
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
      if (!decoded) throw new Error("Invalid refresh token");
      if (typeof decoded === "object" && "userId" in decoded) {
        const newAccessToken = jwt.sign(
          { userId: decoded.userId },
          ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        return newAccessToken;
      }
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const isExistUser = await userRepository.findOneByEmail(email);
      if (!isExistUser) throw new Error("Email not registered");

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

    if (!user) throw new Error("Invalid or token expired");

    await userRepository.updatePassword({
      email: user?.email,
      password: hashedPassword,
    });
  }

  async initiateRegistration(email: string): Promise<void> {
    try {
      const isExist = await userRepository.findOneByEmail(email);
      if (isExist) throw new Error("User already exisit");

      const otp = generateOTP();
      await otpRepository.deleteByEmail(email);
      const expiresAt = new Date(Date.now() + 15 * 60000);

      await otpRepository.create({ email, otp, expiresAt });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP for Registration",
        text: `Your OTP is: ${otp}. It will expire in 15 minutes.`,
        html: `<p>Your OTP is: <strong>${otp}</strong>. It will expire in 15 minutes.</p>`,
      };

      await transporter.sendMail(mailOptions);
      console.log("OTP sent", otp);
    } catch (error) {
      throw error;
    }
  }
  async register({ email, password, name, otp }: typeRegisterUserWithOtp) {
    const validOtp = await otpRepository.findOtpByMail(email);

    console.log("orgOTP: ", validOtp?.otp, validOtp?.expiresAt, "otp: ", otp);
    if (!validOtp || validOtp?.otp != otp || validOtp.expiresAt < new Date())
      throw new Error("Otp expired, Try again!");

    await otpRepository.deleteByEmail(email);
    try {
      const hashedPassword = await hashPassword(password);

      const user = await userRepository.create({
        email,
        password: hashedPassword,
        name,
      });

      return { success: true, user };
    } catch (error: any) {
      throw error;
    }
  }
}

export default new AuthService();
