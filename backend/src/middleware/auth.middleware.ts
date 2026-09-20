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

    const [scheme, token, ...extraParts] = authHeader.trim().split(/\s+/);

    if (scheme !== "Bearer" || !token || extraParts.length > 0) {
      throw new AppError("Invalid authorization header", 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET!) as AuthPayload;

    const userId = Number(decoded.sub);

    if (!decoded.sub || !Number.isInteger(userId) || userId <= 0) {
      throw new AppError("Invalid token subject", 401);
    }

    req.user = {
      userId,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid or expired token", 401));
    }

    next(error);
  }
}
