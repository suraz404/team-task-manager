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
export const updateMemberRoleSchema = z.object({
  role: z.enum(["ADMIN", "MANAGER", "MEMBER"]),
});
export const updateProjectSchema = z.object({
  name: z.string().trim().min(1).optional(),
  description: z.string().trim().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Task title is required"),
  assignedTo: z.number().int().positive().nullable().optional(),
});
