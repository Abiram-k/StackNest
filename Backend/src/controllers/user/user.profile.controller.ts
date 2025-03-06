import { NextFunction, Response } from "express";
import { AuthRequest } from "../../types/IAuth";
import { UserProfileService } from "../../services/user/user.profile.service";

export class UserProfileController {
  private userProfileService: UserProfileService;

  constructor(userProfileService: UserProfileService) {
    this.userProfileService = userProfileService;
  }

  async getUserData(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new Error("No User in Req");
      const { userId } = req.user;
      if (!userId) throw new Error("User Id not get");
      const userDetails = await this.userProfileService.getUserDetails(userId);
      res.json({ success: true, userDetails, message: "User details fetched" });
    } catch (error) {
      next(error);
    }
  }

  async updateUserProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await this.userProfileService.updateUserDetails(
        req.user?.userId as string,
        req.body
      );
      res.json({ success: true, message: "updated user profile" });
    } catch (error) {
      next(error);
    }
  }
}
