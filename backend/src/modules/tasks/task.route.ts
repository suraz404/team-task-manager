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

// GET /api/projects/:projectId/tasks
router.get("/:projectId/tasks", authenticate, getTasksController);

// GET /api/projects/:projectId/tasks/:id
router.get("/:projectId/tasks/:id", authenticate, getTaskController);

// POST /api/projects/:projectId/tasks
router.post(
  "/:projectId/tasks",
  authenticate,
  validate(createTaskSchema),
  createTaskController,
);

// PATCH /api/projects/:projectId/tasks/:id
router.patch("/:projectId/tasks/:id", authenticate, updateTaskController);

// DELETE /api/projects/:projectId/tasks/:id
router.delete("/:projectId/tasks/:id", authenticate, deleteTaskController);

export default router;
