import { Router } from "express";

import {
  getTasksController,
  getTaskController,
  createTaskController,
  updateTaskController,
  deleteTaskController,
} from "./task.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createTaskSchema } from "./task.validation.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

// GET /api/tasks
router.get("/", authenticate, getTasksController);

// GET /api/tasks/:id
router.get("/:id", authenticate, getTaskController);

// POST /api/tasks
router.post(
  "/",
  authenticate,
  validate(createTaskSchema),
  createTaskController,
);

// PATCH /api/tasks/:id
router.patch("/:id", authenticate, updateTaskController);

// DELETE /api/tasks/:id
router.delete("/:id", authenticate, deleteTaskController);

export default router;
