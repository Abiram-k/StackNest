import "reflect-metadata";
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
import http from "http";
import { errorLogger, setupLogRotation } from "./utils/logger.js";
import configurePassport from "./config/passport";
import initSocketIO from "./socket";
import { Server } from "socket.io";
config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initSocketIO(io);

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet());
configurePassport();
// app.use(morgan("dev"));
app.use(errorLogger);
setupLogRotation();

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Welcome to the Stack Nest API",
  });
});

app.use("/auth", AuthRoutes);
app.use("/users", verifyUser, userRoutes);
app.use("/admin", verifyUser, verifyAdmin, adminRoutes);

app.use(errorHandler);

export default server;
