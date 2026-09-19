import type { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

import { AppError } from "../utils/AppError.js";
import type { AuthPayload } from "../types/auth.type.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Authentication required", 401);
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new AppError("Invalid authorization header", 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET!) as AuthPayload;

    if (!decoded) {
      throw new AppError("INvalid jwt token", 456);
    }

    const userId = Number(decoded.sub);

    req.user = {
      userId,
    };

    console.log("req.user:", req.user);

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid or expired token", 401));
    }

    next(error);
  }
}
