import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  userId: string;
  role: string;
}

interface AuthRequest extends Request {
  user?: DecodedToken;
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      message: "Server Error: JWT Access Secret(verify user) is missing",
    });
  }

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as DecodedToken;

    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
