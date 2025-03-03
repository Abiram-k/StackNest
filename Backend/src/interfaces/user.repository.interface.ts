import { typeUserResetToken, verifyUserProfileSchemaType } from "../../../types/user";
import { IUser } from "../types/IUser";

export interface IUserRepository {
    
  findByIdAndUpdate(id:string,data:verifyUserProfileSchemaType): Promise<IUser | null>;

  findUserByGoogleId(googleId: string): Promise<IUser | null>;

  updateUserWithGoogleId(email: string, googleId: string): Promise<boolean>;

  create(userData: Partial<IUser>): Promise<IUser>;

  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  setPassResetToken({
    email,
    resetToken,
  }: {
    email: string;
    resetToken: string;
  }): Promise<boolean>;
  updatePassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<boolean>;

  findUserByRestToken(data: typeUserResetToken): Promise<IUser | null>;

  getFailedAttempts(email: string): Promise<number | undefined>;

  updateFailedAttempts(email: string): Promise<IUser | null>;

  blockUserAfterFailedAttempt(
    email: string,
    blockDuration: number
  ): Promise<IUser>;

  resetFailedAttempts(email: string): Promise<IUser | null>;

  updateLastLogin(email: string): Promise<void>;

}


// // interfaces/user.repository.interface.ts
// export interface IUserBaseRepository<T> {
//   create(data: Partial<T>): Promise<T>;
//   findById(id: string): Promise<T | null>;
//   findByEmail(email: string): Promise<T | null>;
//   findByIdAndUpdate(id: string, data: Partial<T>): Promise<T | null>;
// }

// export interface IUserAuthRepository<T> {
//   updateLastLogin(email: string): Promise<void>;
//   updateFailedAttempts(email: string): Promise<T | null>;
//   blockUserAfterFailedAttempt(email: string): Promise<T>;
//   resetFailedAttempts(email: string): Promise<T | null>;
// }

// export interface IUserPasswordRepository<T> {
//   setPassResetToken(email: string, resetToken: string): Promise<void>;
//   updatePassword(email: string, password: string): Promise<void>;
// }

// export interface IUserSocialRepository<T> {
//   findUserByGoogleId(googleId: string): Promise<T | null>;
//   updateUserWithGoogleId(email: string, googleId: string): Promise<void>;
// }