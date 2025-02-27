import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { config } from "dotenv";
config();

interface JwtPayload {
  userId: Types.ObjectId;
  role: string;
}

export const generateJWT = (data: JwtPayload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }
  const token = jwt.sign(
    {data },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
  return token;
};

export const generateAccessToken = (data: JwtPayload) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined in the environment variables");
  }
  const token = jwt.sign(
    { data },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "15m" }
  );
  return token;
};

export const generateRefreshToken = (data: JwtPayload) => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined in the environment variables");
  }
  const token = jwt.sign(
    { data },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );
  return token;
};
