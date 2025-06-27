import { IOTP } from "../../types/IOtp";

export interface IOtpRepository<T> {
  findOtpByMail(email: string): Promise<T | null>;
  deleteByEmail(email: string): Promise<void>;
  create(data: T): Promise<void>;
}
