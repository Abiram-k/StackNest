import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { UserBaseRepository } from "../../repositories/user.repository";
import { config } from "dotenv";
import { DecodedToken } from "../../types/IAuth";
import createHttpError from "http-errors";
import { HttpStatus } from "../../constants/enum.statusCode";
config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
export const socketAuth = async (socket: Socket, next: any) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      console.log("Token not founded");
      return;
    }
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as DecodedToken;
    const userBaseRepository = new UserBaseRepository();

    const user = await userBaseRepository.findById(decoded.userId as string);
    console.log("Email after socket auth:", user?.email);
    if (!user) {
      throw createHttpError(HttpStatus.NOT_FOUND, "User not found");
    }
    if (user.isBlocked) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        "Access Denied: User is blocked"
      );
    }

    socket.data.user = {
      userName:user.userName,
      avatar:user.avatar,
      userId: decoded.userId as string,
      role: decoded.role,
    };
    next();
  } catch (error: any) {
    console.log(error);
    next(new Error(error.message || "Authentication error"));
  }
};
