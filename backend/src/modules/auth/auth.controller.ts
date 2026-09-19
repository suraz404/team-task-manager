import type { Request, Response, NextFunction } from "express";

import { registerUser } from "./auth.services.js";

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;

    const user = await registerUser(email, password);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
