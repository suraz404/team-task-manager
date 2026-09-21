import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  console.error(err);
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    err.code === "23505"
  ) {
    return res.status(409).json({
      success: false,
      error: "Project with this name already exists",
    });
  }

  return res.status(500).json({
    success: false,
    error: "Internal server error",
  });
}
