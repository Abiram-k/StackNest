import { Response } from "express";

export const validateDtoError = (errors: any, res: Response): boolean => {
  if (errors.length) {
    console.log(
      errors.map((err: any) => ({
        property: err.property,
        constraints: err.constraints,
      }))
    );
    res.status(400).json({
      message: "Validation failed",
      errors: errors.map((err: any) => ({
        property: err.property,
        constraints: err.constraints,
      })),
    });
    return false;
  }
  return true;
};
