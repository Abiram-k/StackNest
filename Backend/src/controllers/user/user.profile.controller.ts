import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../types/IAuth";
import { UserProfileService } from "../../services/user/user.profile.service";

import { config } from "dotenv";
import axios from "axios";
import { findAnswers } from "../../utils/qaMatcher";
config();

const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;
const HUG_FACE_API_KEY = process.env.HUG_FACE_API_KEY;
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

  async chatBotResponse(req: Request, res: Response, next: NextFunction) {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
    }

    try {
      if (["hello", "hi", "hey", "hai"].includes(prompt.toLowerCase())) {
        res.json({
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
          res.json({ response: predefinedAnswer });
        }, 2000);
        return;
      }

      const isRelatedQuery = STACKNEST_KEYWORDS.some((keyword) =>
        prompt.toLowerCase().includes(keyword.toLowerCase())
      );

      if (!isRelatedQuery) {
        res.json({
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
            temperature: 0.3, // Less randomness
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
      res.json({ response: response.data[0].summary_text });
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      next("AI Processing failed");
    }
  }
}
