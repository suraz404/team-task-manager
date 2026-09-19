import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { createUser, findUserByEmail } from "./auth.repository.js";

import { AppError } from "../../utils/AppError.js";

export async function registerUser(email: string, password: string) {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const newUser = await createUser(email, passwordHash);

  return newUser;
}

export async function loginUser(email: string, password: string) {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new AppError("JWT secret is not configured", 500);
  }

  const token = jwt.sign({ email: user.email }, jwtSecret, {
    subject: String(user.id),
    expiresIn: "1d",
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    },
    token,
  };
}
