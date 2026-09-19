import type { Request, Response, NextFunction } from "express";

import { registerUser } from "./auth.services.js";
import { loginUser } from "./auth.services.js";

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

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;

    const loginResult = await loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: loginResult,
    });
  } catch (error) {
    next(error);
  }
}
