import { title } from "node:process";
import z from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1),
});
