import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";

class AuthController {
  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;

      if (!token) throw new Error("Google token is required");

      const resToken = await AuthService.authenticateGoogleUser(token);
      res.json({
        success: true,
        message: "User logged in successfully",
        token: resToken,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, captchaToken } = req.body;

      if (!captchaToken) throw new Error("Captcha is required");
      if (!email || !password)
        throw new Error("Email and password are required");

      const token = await AuthService.login({ email, password, captchaToken });
      res.json({
        success: true,
        token,
        message: "User logged in successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }

  async initiateRegistration(req:Request,res:Response,next:NextFunction){
    try{
      const {email} = req.body;
      console.log(email,"Email");
      await AuthService.initiateRegistration(email)
      res.status(200).json({success:true,message:"OTP sent successfully"})
    }catch(error) {
     next(error);
    }
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try { 
      const { name, email, password,otp } = req.body;
      if (!name || !email || !password) throw new Error("Credential missing!");
      await AuthService.register({ name, email, password,otp });
      res.status(200).json({ success: true });
    } catch (error: any) {
      next(error);
    }
  }
}
 
export default new AuthController();
