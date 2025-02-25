import { Request, Response,NextFunction } from "express";
import AuthService from "../services/auth.service";

class AuthController {
  async login(req: Request, res: Response,next:NextFunction): Promise<void> {
    console.log("From auth controller");
    try {
      const { email, password } = req.body;
      if (!email || !password)
        throw new Error("Email and password are required");
      const token = await AuthService.login({ email, password });
      res.json({
        success: true,
        token,
        message: "User logged in successfully",
      });
    } catch (error: any) {
        next(error);
    //   res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default new AuthController();
