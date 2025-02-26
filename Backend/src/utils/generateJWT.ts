import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { config } from "dotenv";
config();

interface JwtPayload {
  id: Types.ObjectId;
  email: string;
  role: string;
}

export const generateJWT = ({ id, email, role }: JwtPayload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }
  const token = jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
  return token;
};

export const generateAccessToken = ({ id, email, role }: JwtPayload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }
  const token = jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );
  return token;
};

export const generateRefreshToken = ({ id, email, role }: JwtPayload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }
  const token = jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
  return token;
};
