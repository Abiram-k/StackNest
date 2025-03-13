import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { HttpStatus } from "../constants/enum.statusCode";

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error, "From centralized");

  if (createHttpError.isHttpError(error)) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message || " Error Occured",
    });
    console.error(error.statusCode, error.message);
  } else {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export default errorHandler;
