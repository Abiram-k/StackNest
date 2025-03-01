import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "../src/routes/user.routes";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandling";
import { config } from "dotenv";
config();

const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials:true})); //http://localhost:5173
app.use(helmet());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Welcome to the Stack Nest api API",
  });
});

app.use("/users", userRoutes);
app.use("/admin", adminRoutes);

app.use(errorHandler);
// app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
//   console.log("From Centeralized Error Handler: ",error.message);
//   console.error(error.stack);
//   res.status(500).json({
//     success: false,
//     message: error.message || "Internal Server Error",
//   });
// });

export default app;
