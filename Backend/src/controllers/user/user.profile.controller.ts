import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../types/IAuth";
// import { UserProfileService } from "../../services/user.profile.service";
import { config } from "dotenv";
import axios from "axios";
// import { findAnswers } from "../../utils/qaMatcher";
import { HttpStatus } from "../../constants/enum.statusCode";
import { IUserProfileController } from "../../interfaces/controllers/user.profile.controller.interface";
import { IUserProfileService } from "../../interfaces/services/user.profile.service.interface";
import {
  ResGetUserDataDTO,
  ResProfileData,
} from "../../dtos/user/profile/getUserData.dto";
import { UserResTypeDTO } from "../../dtos/public/userData.dto";
import { ResUpdateUserProfileDTO } from "../../dtos/user/profile/updateUserProfile.dto";
import { ResGetUserCardData } from "../../dtos/user/profile/getUserCardData.dto";
import { Types } from "mongoose";
config();

const HUG_FACE_API_KEY = process.env.HUG_FACE_API_KEY;
export class UserProfileController implements IUserProfileController {
  private _userProfileService: IUserProfileService;

  constructor(userProfileService: IUserProfileService) {
    this._userProfileService = userProfileService;
  }

  async getUserData(
    req: AuthRequest,
    res: Response<ResGetUserDataDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) throw new Error("No User in Req");
      const { userId } = req.user;
      if (!userId) throw new Error("User Id not get");
      const user = await this._userProfileService.getUserDetails(userId);

      const formattedUsers: ResProfileData = {
        firstName: user.firstName,
        userName: user.userName,
        email: user.email,
        country: user.country,
        description: user.description,
        gender: user.gender,
        mobileNumber: user.mobileNumber,
        avatar: user.avatar,
        streak: user.streak as number,
        streakClaimDate: user.streakClaimDate as Date,
      };

      res.status(HttpStatus.OK).json({
        success: true,
        userDetails: formattedUsers,
        message: "User details fetched",
      });
    } catch (error) {
      next(error);
    }
  }

  async getCardData(req: Request, res: Response<ResGetUserCardData>, next: NextFunction): Promise<void> {
      try{
      const user = req.user as { userId: Types.ObjectId; role: string };
      const data = await this._userProfileService.getCardData(user.userId)
      res.status(HttpStatus.OK).json({message:"Card data fetched",success:true,data})
      }catch(error){
        next(error);
      }
  }

  async updateUserProfile(
    req: AuthRequest,
    res: Response<ResUpdateUserProfileDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      await this._userProfileService.updateUserDetails(
        req.user?.userId as string,
        req.body
      );
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "updated user profile" });
    } catch (error) {
      next(error);
    }
  }



  async checkinUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) throw new Error("No User in Req");
      const { userId } = req.user as { userId: string; role: string };
      if (!userId) throw new Error("User Id not get");

      await this._userProfileService.checkinUser(userId);
      res
        .status(HttpStatus.OK)
        .json({ message: "User checkedin", success: true });
    } catch (error) {
      next(error);
    }
  }
  async getUserStreakCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (!req.user) throw new Error("No User in Req");
    const { userId } = req.user as { userId: string; role: string };
    if (!userId) throw new Error("User Id not get");

    const streakCount = await this._userProfileService.getUserStreakCount(
      userId
    );
    if (!streakCount) return;
    res
      .status(HttpStatus.OK)
      .json({ message: "Fetched streak count", success: true, streakCount });
  }
  async getChallengePoints(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) throw new Error("No User in Req");
      const { userId } = req.user as { userId: string; role: string };
      if (!userId) throw new Error("User Id not get");

      const pointsCount = await this._userProfileService.getUserChallengePoints(
        userId
      );

      res.status(HttpStatus.OK).json({
        message: "Fetched challenge points count",
        success: true,
        pointsCount,
      });
    } catch (error) {
      next(error);
    }
  }
}
