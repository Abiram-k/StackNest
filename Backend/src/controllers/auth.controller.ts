import { Request, Response, NextFunction } from "express";
import { LoginResponse } from "../../../types/index";
import { config } from "dotenv";
import { AuthService } from "../services/auth.service";
config();

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      console.log(token);
      if (!token) throw new Error("Google token is required");

      const authResponse = await this.authService.authenticateGoogleUser(token);

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

      res.json(data);
    } catch (error: any) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, captchaToken, role } = req.body;
      console.log(email, password, captchaToken, role);

      if (!email || !password)
        throw new Error("Email and password are required");

      if (!role) throw new Error("Role is required");

      const { accessToken, refreshToken } = await this.authService.login({
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

      res.json(data);
    } catch (error: any) {
      next(error);
    }
  }

  async generateAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { role } = req.query;
      if (!role) {
        console.log("No role founded during generating new access token");
        return;
      }

      // const refreshToken = req.cookies.userRefreshToken;
      const refreshToken = req.cookies[`${role}RefreshToken`];

      if (!refreshToken) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const newAccessToken = await this.authService.generateAccessToken(
        refreshToken,
      );

      res.json({
        success: true,
        accessToken: newAccessToken,
        message: "Access token sended successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async initiateRegistration(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await this.authService.initiateRegistration(email);
      res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      next(error);
    }
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, password, otp } = req.body;
      if (!name || !email || !password) throw new Error("Credential missing!");
      await this.authService.register({ name, email, password, otp });
      res.status(200).json({ success: true });
    } catch (error: any) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);
      res
        .status(200)
        .json({ success: true, message: "Mail sended successfully" });
    } catch (error: any) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body;
      await this.authService.resetPassword(token, password);
      res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      next(error);
    }
  }

  async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body);
    } catch (error) {
      next(error);
    }
  }
}
