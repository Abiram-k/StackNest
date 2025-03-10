import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { UserBaseRepository } from "../../repositories/user.repository";
import { config } from "dotenv";
import { DecodedToken } from "../../types/IAuth";
import createHttpError from "http-errors";
config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
export const socketAuth = async (socket: Socket, next: any) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as DecodedToken;
    const userBaseRepository = new UserBaseRepository();

    const user = await userBaseRepository.findById(decoded.userId as string);
    if (!user) {
      throw createHttpError(404, "User not found");
    }
    if (user.isBlocked) {
      throw createHttpError(403, "Access Denied: User is blocked");
    }

    socket.data.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
};
