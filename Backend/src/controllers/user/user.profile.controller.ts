import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../types/IAuth";
// import { UserProfileService } from "../../services/user.profile.service";

import { config } from "dotenv";
import axios from "axios";
import { findAnswers } from "../../utils/qaMatcher";
import { HttpStatus } from "../../constants/enum.statusCode";
import { IUserProfileController } from "../../interfaces/controllers/user.profile.controller.interface";
import { IUserProfileService } from "../../interfaces/services/user.profile.service.interface";
import {
  ResGetUserDataDTO,
  ResProfileData,
} from "../../dtos/user/profile/getUserData.dto";
import { UserResTypeDTO } from "../../dtos/public/userData.dto";
import { ResUpdateUserProfileDTO } from "../../dtos/user/profile/updateUserProfile.dto";
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
      };

      res
        .status(HttpStatus.OK)
        .json({
          success: true,
          userDetails: formattedUsers,
          message: "User details fetched",
        });
    } catch (error) {
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

  async chatBotResponse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(HttpStatus.NOT_FOUND).json({ error: "Prompt is required" });
    }

    try {
      if (["hello", "hi", "hey", "hai"].includes(prompt.toLowerCase())) {
        res.status(HttpStatus.OK).json({
          response:
            "Hello! I'm StackNest Assistant. Ask me about collaboration features or technical help!",
        });
        return;
      }

      const STACKNEST_KEYWORDS = [
        "stacknest",
        "collaborate",
        "room",
        "feed",
        "technical issue",
        "developer",
        "connect",
        "platform",
        "challenge",
        "friends",
      ];

      const predefinedAnswer = findAnswers(prompt);
      if (predefinedAnswer) {
        setTimeout(() => {
          res.status(HttpStatus.OK).json({ response: predefinedAnswer });
        }, 2000);
        return;
      }

      const isRelatedQuery = STACKNEST_KEYWORDS.some((keyword) =>
        prompt.toLowerCase().includes(keyword.toLowerCase())
      );

      if (!isRelatedQuery) {
        res.status(HttpStatus.BAD_REQUEST).json({
          response:
            "Please ask questions related to the StackNest application.",
        });
        return;
      }

      const response = await axios.post(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        {
          inputs: `As a StackNest assistant, answer concisely: ${prompt}`,
          parameters: {
            max_length: 150,
            temperature: 0.3,
            top_p: 0.9,
            repetition_penalty: 1.5,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${HUG_FACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );
      res
        .status(HttpStatus.OK)
        .json({ response: response.data[0].summary_text });
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      next("AI Processing failed");
    }
  }
}
