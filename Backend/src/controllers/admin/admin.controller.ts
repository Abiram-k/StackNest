import { Request, Response, NextFunction } from "express";
import { AdminService } from "../../services/admin/admin.auth.service";
import { LoginResponse } from "../../../../types/index";
import createHttpError from "http-errors";

export class AdminController {
  private readonly adminService: AdminService;

  constructor(adminService: AdminService) {
    this.adminService = adminService;
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, captchaToken } = req.body;

      if (!email || !password)
        throw createHttpError(401, "Email and password are required");

      const { accessToken, refreshToken } = await this.adminService.login({
        email,
        password,
        captchaToken,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
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
}
