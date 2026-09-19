import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "./auth.repository.js";
import { AppError } from "../../utils/AppError.js";

export async function registerUser(email: string, password: string) {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError("User already exists", 400);
    return;
  }

  const hashPassword = await bcrypt.hash(password, 12);

  const newUser = createUser(email, hashPassword);

  return newUser;
}
