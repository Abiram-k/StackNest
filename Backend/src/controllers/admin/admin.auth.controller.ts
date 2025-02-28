


import { Request, Response, NextFunction } from "express";
import authService from "../../services/admin/admin.auth.service";
import {LoginResponse} from '../../../../types/index'
import createHttpError from 'http-errors';

class AuthController {
async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, captchaToken } = req.body;

      if (!email || !password)
        
        throw createHttpError(401,"Email and password are required");

      const { accessToken, refreshToken } = await authService.login({
        email,
        password,
        captchaToken,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      const data:LoginResponse = { success: true,
        accessToken,
        message: "Login successfull",}
      res.json(data);

    } catch (error: any) {
      next(error);
    }
  }

}

export default new AuthController();
