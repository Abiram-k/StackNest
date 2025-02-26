import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "../src/routes/user.routes";
import cookieParser from "cookie-parser";


const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Welcome to the Stack Nest api API",
  }); 
});

app.use("/users", routes);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log("From Centeralized Error Handler");
  console.error(error.stack);
  res.status(500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
});



export default app;
