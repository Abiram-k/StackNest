import { typeUserResetToken } from "../../../types/user";
import { IUser } from "../types/IUser";

export interface IUserRepository {
    
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
