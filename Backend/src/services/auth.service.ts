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
config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
class AuthService {
  async authenticateGoogleUser(token: string) {
    const payload = await googleUserResponse(token);

    if (!payload) throw new Error("Invalid google token");

    const user = await userRepository.findUserByGoogleId(payload.id);

    if (!user) {
      const newUser = await userRepository.create({
        googleId: payload.id,
        email: payload.email,
        name: payload.given_name,
        role: "user",
        avatar: payload.picture,
      });

      const token = generateJWT({
        email: newUser.email,
        id: newUser._id as Types.ObjectId,
        role: newUser.role,
      });

      return { token };
    }
  }

  async login({ email, password, captchaToken }: LoginUser) {
    {
      try {
        if (captchaToken) {
          const captchaResponse = await verifyCaptcha(captchaToken);
          if (!captchaResponse) throw new Error("Captcha verification failed");
        }

        const user = await userRepository.findOneByEmail(email);

        if (!user) throw new Error("User not found");

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) throw new Error("Invalid password");
        const token = generateJWT({
          email: user.email,
          id: user._id as Types.ObjectId,
          role: user.role,
        });
        return { token };
      } catch (error) {
        throw error;
      }
    }
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
    if (!otp) throw new Error("Otp not get");
    console.log(otp);
    try {
      const hashedPassword = await hashPassword(password); // Implement hash function

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
