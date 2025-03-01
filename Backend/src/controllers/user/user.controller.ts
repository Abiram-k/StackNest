import { Request, Response, NextFunction } from "express";
import AuthService from "../../services/user/user.service";
import authService from "../../services/user/user.service";
import { LoginResponse } from "../../../../types/index";
import { config } from "dotenv";
import { AuthRequest } from "../../types/IAuth";
config();
// console.log(process.env.NODE_ENV)
class UserController {
  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;

      if (!token) throw new Error("Google token is required");

      const authResponse = await AuthService.authenticateGoogleUser(token);
      if (!authResponse) {
        throw new Error("Authentication failed: No response from service");
      }
      const { accessToken, refreshToken } = authResponse;

      res.cookie("userRefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: "lax",
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
      const { email, password, captchaToken } = req.body;

      if (!email || !password)
        throw new Error("Email and password are required");

      const { accessToken, refreshToken } = await AuthService.login({
        email,
        password,
        captchaToken,
      });

      res.cookie("userRefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        domain:
          process.env.NODE_ENV === "production"
            ? ".yourdomain.com"
            : "localhost",
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
      // const role = req.query.role;
      const refreshToken = req.cookies.userRefreshToken;
      if (!refreshToken) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const newAccessToken = await authService.generateAccessToken(
        refreshToken
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
      await AuthService.initiateRegistration(email);
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
      await AuthService.register({ name, email, password, otp });
      res.status(200).json({ success: true });
    } catch (error: any) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword(email);
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
      await AuthService.resetPassword(token, password);
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

  async getUserData(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new Error("No User in Req");
      const { userId } = req.user;
      if (!userId) throw new Error("User Id not get");
      const userDetails = await authService.getUserDetails(userId);
      res.send({ success: true, userDetails, message: "User details fetched" });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
