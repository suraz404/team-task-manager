// project.validation.ts

import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().optional(),
});
export const addMemberSchema = z.object({
  userId: z.number().int().positive(),
  role: z.enum(["ADMIN", "MANAGER", "MEMBER"]),
});
