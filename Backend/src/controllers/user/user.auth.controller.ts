// import { Request, Response, NextFunction } from "express";
// import {UserAuthService} from "../../services/user/user.auth.service";
// import { LoginResponse } from "../../../../types/index";
// import { config } from "dotenv";
// import { AuthRequest } from "../../types/IAuth";
// config();
// // console.log(process.env.NODE_ENV)
// export class UserAuthController {

//   private userAuthService:UserAuthService;

//   constructor(userAuthService:UserAuthService){
//     this.userAuthService = userAuthService;
//   }

//   async googleAuth(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { token } = req.body;

//       if (!token) throw new Error("Google token is required");

//       const authResponse = await this.userAuthService.authenticateGoogleUser(token);
//       if (!authResponse) {
//         throw new Error("Authentication failed: No response from service");
//       }
//       const { accessToken, refreshToken } = authResponse;

//       res.cookie("userRefreshToken", refreshToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
//         domain:"localhost",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//         path: "/",
//       });

//       const data: LoginResponse = {
//         success: true,
//         accessToken,
//         message: "Login successfull",
//       };
//       res.json(data);

//     } catch (error: any) {
//       next(error);
//     }
//   }

//   async login(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const { email, password, captchaToken } = req.body;
//       // console.log(email,password,captchaToken);
//       if (!email || !password)
//         throw new Error("Email and password are required");

//       const { accessToken, refreshToken } = await this.userAuthService.login({
//         email,
//         password,
//         captchaToken,
//       });

//       res.cookie("userRefreshToken", refreshToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
//         domain:"localhost",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//         path: "/",
//       });

//       const data: LoginResponse = {
//         success: true,
//         accessToken,
//         message: "Login successfull",
//       };
//       res.json(data);
//     } catch (error: any) {
//       next(error);
//     }
//   }

//   async generateAccessToken(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> {
//     try {
//       // const role = req.query.role;
//       const refreshToken = req.cookies.userRefreshToken;
//       if (!refreshToken) {
//         res.status(401).json({ message: "Unauthorized" });
//         return;
//       }
//       const newAccessToken = await this.userAuthService.generateAccessToken(
//         refreshToken
//       );

//       res.json({
//         success: true,
//         accessToken: newAccessToken,
//         message: "Access token sended successfully",
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async initiateRegistration(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { email } = req.body;
//       await this.userAuthService.initiateRegistration(email);
//       res.status(200).json({ success: true, message: "OTP sent successfully" });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async register(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> {
//     try {
//       const { name, email, password, otp } = req.body;
//       if (!name || !email || !password) throw new Error("Credential missing!");
//       await this.userAuthService.register({ name, email, password, otp });
//       res.status(200).json({ success: true });
//     } catch (error: any) {
//       next(error);
//     }
//   }

//   async forgotPassword(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { email } = req.body;
//       await this.userAuthService.forgotPassword(email);
//       res
//         .status(200)
//         .json({ success: true, message: "Mail sended successfully" });
//     } catch (error: any) {
//       next(error);
//     }
//   }

//   async resetPassword(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { token, password } = req.body;
//       await this.userAuthService.resetPassword(token, password);
//       res.status(200).json({ success: true, message: "OTP sent successfully" });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async updateUserProfile(req: Request, res: Response, next: NextFunction) {
//     try {
//       console.log(req.body);
//     } catch (error) {
//       next(error);
//     }
//   }
// }

