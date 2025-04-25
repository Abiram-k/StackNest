import passport, { Profile } from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { AuthService } from "../services/auth.service.js";
import { UserBaseRepository } from "../repositories/user.repository.js";
import { UserAuthRespository } from "../repositories/user.repository.js";
import { IUser } from "../types/IUser.js";
import {
  IUserAuthRepository,
  IUserBaseRepository,
} from "../interfaces/repositories/user.repository.interface.js";
import { IAuthService } from "../interfaces/services/auth.service.interface.js";
import { config } from "dotenv";
import axios from "axios";
import { VerifyCallback } from "jsonwebtoken";
config();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID as string;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET as string;
const CALLBACK_URL = process.env.GITHUB_CALLBACK_URL || "/auth/github/callback";

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  throw new Error("Missing GitHub OAuth credentials in environment variables.");
}

const userAuthRespository: IUserAuthRepository<IUser> =
  new UserAuthRespository();
const userBaseRepository: IUserBaseRepository<IUser> = new UserBaseRepository();
const authService: IAuthService = new AuthService(
  userBaseRepository,
  userAuthRespository
);

export default function configurePassport() {
  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: CALLBACK_URL,
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) => {
        try {
          let email = "";
          if (profile.emails?.length) {
            email = profile.emails[0].value;
          } else {
            const emailResponse = await axios.get(
              "https://api.github.com/user/emails",
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  Accept: "application/vnd.github.v3+json",
                },
              }
            );

            const primaryEmail = emailResponse.data.find(
              (emailObj: any) => emailObj.primary && emailObj.verified
            );
            email = primaryEmail?.email || emailResponse.data[0]?.email || "";
          }
          const user: IUser = await authService.handleGithubLogin({
            githubId: profile.id,
            firstName: profile.username,
            email: email || "",
            avatar: profile.photos?.[0]?.value || "",
          });

          done(null, user);
        } catch (error: any) {
          console.error("Error during GitHub authentication:", error);
          done(error);
        }
      }
    )
  );
}
