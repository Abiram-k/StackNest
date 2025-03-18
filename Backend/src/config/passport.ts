// import passport from "passport";
// import { Strategy as GitHubStrategy } from "passport-github2";
// import { AuthService } from "../services/auth.service";
// import { UserBaseRepository } from "../repositories/user.repository";
// import { UserAuthRespository } from "../repositories/user.repository";
// import { IUser } from "../types/IUser";
// import {
//   IUserAuthRepository,
//   IUserBaseRepository,
// } from "../interfaces/repositories/user.repository.interface";
// import { IAuthService } from "../interfaces/services/auth.service.interface";
// import { config } from "dotenv";
// config();

// // Load environment variables
// const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID as string;
// const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET as string;
// const CALLBACK_URL = process.env.GITHUB_CALLBACK_URL || "/auth/github/callback";

// // Ensure required env variables are set
// if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
//   throw new Error("Missing GitHub OAuth credentials in environment variables.");
// }

// const userAuthRespository: IUserAuthRepository<IUser> =
//   new UserAuthRespository();
// const userBaseRepository: IUserBaseRepository<IUser> = new UserBaseRepository();
// const authService: IAuthService = new AuthService(
//   userBaseRepository,
//   userAuthRespository
// );

// export default function configurePassport() {
//   passport.use(
//     new GitHubStrategy(
//       {
//         clientID: GITHUB_CLIENT_ID,
//         clientSecret: GITHUB_CLIENT_SECRET,
//         callbackURL: CALLBACK_URL,
//       },
//       async (
//         accessToken: string,
//         refreshToken: string,
//         profile: any,
//         done: any
//       ) => {
//         try {
//           console.log("GitHub profile received:", profile);

//           // Handle GitHub login
//           const user = await authService.handleGithubLogin(profile);
//           done(null, user);
//         } catch (error) {
//           console.error("Error during GitHub authentication:", error);
//           done(error);
//         }
//       }
//     )
//   );

//   passport.serializeUser((user: any, done) => {
//     console.log(`Serializing user: ${user?.id}`);
//     done(null, user?.id as string); 
//   });
  
//   passport.deserializeUser(async (id: string, done) => {
//     console.log(`Deserializing user with ID: ${id}`);
//     try {
//       const user = await authService.findUserById(id);
//       done(null, user);
//     } catch (error) {
//       done(error);
//     }
//   });
// }
