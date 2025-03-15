import { Request, Response, NextFunction } from "express";
import { LoginResponse } from "../../../types/index";
import { config } from "dotenv";
// import { AuthService } from "../services/auth.service";
import { HttpStatus } from "../constants/enum.statusCode";
import { IAuthController } from "../interfaces/controllers/auth.controller.interface";
import { IAuthService } from "../interfaces/services/auth.service.interface";
import { plainToInstance } from "class-transformer";
import { GoogleAuthDTO } from "../dtos/auth/googleAuth.dto";
import { validate } from "class-validator";
import { validateDtoError } from "../utils/ValidateDtoError";
import { LoginDTO, ResLoginDTO } from "../dtos/auth/login.dto";
import {
  GenerateAccessDTO,
  ResGenerateAccessDTO,
} from "../dtos/auth/generateAccess.dto";
import {
  InitiateRegistrationDTO,
  ResInitiateRegistrationDTO,
} from "../dtos/auth/initiateRegistration.dto";
import { RegisterDTO, ResRegisterDTO } from "../dtos/auth/register.dto";
import {
  ForgotPasswordDTO,
  ResForgotPasswordDTO,
} from "../dtos/auth/forgotPassword.dto";
import {
  ResetPasswordDTO,
  ResResetPasswordDTO,
} from "../dtos/auth/resetPassword.dto";
import cloudinary from "../config/cloudinary";
config();

const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET as string;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY as string;

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME as string;

export class AuthController implements IAuthController {
  private _authService: IAuthService;

  constructor(authService: IAuthService) {
    this._authService = authService;
  }

  async googleAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // const { token } = req.body;
      const dto = plainToInstance(GoogleAuthDTO, req.body);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;

      const { token } = dto;

      if (!token) throw new Error("Google token is required");

      const authResponse = await this._authService.authenticateGoogleUser(
        token
      );

      if (!authResponse) {
        throw new Error("Authentication failed: No response from service");
      }

      const { accessToken, refreshToken } = authResponse;

      res.cookie("userRefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        domain: "localhost",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      const data: LoginResponse = {
        success: true,
        accessToken,
        message: "Login successfull",
      };

      res.status(HttpStatus.OK).json(data);
    } catch (error: any) {
      next(error);
    }
  }

  async login(
    req: Request,
    res: Response<ResLoginDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      // const { email, password, captchaToken, role } = req.body;

      const dto = plainToInstance(LoginDTO, req.body);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      const { email, password, captchaToken, role } = dto;

      if (!email || !password)
        throw new Error("Email and password are required");

      if (!role) throw new Error("Role is required");

      const { accessToken, refreshToken } = await this._authService.login({
        email,
        password,
        captchaToken,
        role,
      });

      res.cookie(`${role}RefreshToken`, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        domain: "localhost",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      const data: LoginResponse = {
        success: true,
        accessToken,
        message: "Login successfull",
      };

      res.status(HttpStatus.OK).json(data);
    } catch (error: any) {
      next(error);
    }
  }

  async generateAccessToken(
    req: Request,
    res: Response<ResGenerateAccessDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { role } = req.query;
      const dto = plainToInstance(GenerateAccessDTO, req.query);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      // if (!role) {
      //   console.log("No role founded during generating new access token");
      //   return;
      // }
      const refreshToken = req.cookies[`${role}RefreshToken`];

      if (!refreshToken) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, message: "Unauthorized", accessToken: "" });
        return;
      }

      const newAccessToken = await this._authService.generateAccessToken(
        refreshToken
      );

      if (!newAccessToken) {
        console.log("Failed to generate new access Token.");
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        accessToken: newAccessToken,
        message: "Access token sended successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async initiateRegistration(
    req: Request,
    res: Response<ResInitiateRegistrationDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      // const { email } = req.body;
      const dto = plainToInstance(InitiateRegistrationDTO, req.body);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;

      const { email } = dto;

      await this._authService.initiateRegistration(email);
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      next(error);
    }
  }

  async register(
    req: Request,
    res: Response<ResRegisterDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      // const { name, email, password, otp } = req.body;

      const dto = plainToInstance(RegisterDTO, req.body);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      const { name, email, password, otp } = dto;

      if (!name || !email || !password || !otp)
        throw new Error("Credential missing!");
      await this._authService.register({ name, email, password, otp });
      res
        .status(HttpStatus.OK)
        .json({ message: "User registered successfully", success: true });
    } catch (error: any) {
      next(error);
    }
  }

  async forgotPassword(
    req: Request,
    res: Response<ResForgotPasswordDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      // const { email } = req.body;

      const dto = plainToInstance(ForgotPasswordDTO, req.body);
      const errros = await validate(dto);
      if (!validateDtoError(errros, res)) return;
      const { email } = dto;

      await this._authService.forgotPassword(email);
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Mail sended successfully" });
    } catch (error: any) {
      next(error);
    }
  }

  async resetPassword(
    req: Request,
    res: Response<ResResetPasswordDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      // const { token, password } = req.body;

      const dto = plainToInstance(ResetPasswordDTO, req.body);
      const errros = await validate(dto);
      if (!validateDtoError(errros, res)) return;
      const { token, password } = dto;

      await this._authService.resetPassword(token, password);
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      next(error);
    }
  }

  async uploadToSignedCloudinary(
    req: Request,
    res: Response<{
      signature: string;
      timestamp: number;
      apiKey: string;
      cloudName: string;
    }>,
    next: NextFunction
  ): Promise<void> {
    try {
      const timestamp = Math.round(Date.now() / 1000);
      const params = {
        timestamp,
        folder: "stackNest",
      };

      const signature = cloudinary.utils.api_sign_request(
        params,
        CLOUDINARY_API_SECRET
      );

      res.status(HttpStatus.OK).json({
        signature,
        timestamp,
        apiKey: CLOUDINARY_API_KEY,
        cloudName: CLOUDINARY_CLOUD_NAME,
      });
    } catch (error) {
      next(error);
    }
  }
}
