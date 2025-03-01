import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface DecodedToken extends JwtPayload {
    userId?: string;
    role: string;
  }

export interface AuthRequest extends Request {
  user?: DecodedToken;
  headers: {
    authorization?: string;
  };
}