import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "../src/routes/user.routes";
import AuthRoutes from "../src/routes/auth.routes";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandling";
import { config } from "dotenv";
import { verifyUser } from "./middlewares/verifyUser";
import { verifyAdmin } from "./middlewares/verifyAdmin";
config();

const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Welcome to the Stack Nest api API",
  });
});

app.use("/auth", AuthRoutes);
app.use("/users", verifyUser, userRoutes);
app.use("/admin", verifyUser, verifyAdmin, adminRoutes);

app.use(errorHandler);

export default app;
