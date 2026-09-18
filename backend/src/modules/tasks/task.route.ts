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

const router = Router();

// GET /api/tasks
router.get("/", getTasksController);

// GET /api/tasks/:id
router.get("/:id", getTaskController);

// POST /api/tasks
router.post("/", validate(createTaskSchema), createTaskController);

// PATCH /api/tasks/:id
router.patch("/:id", updateTaskController);

// DELETE /api/tasks/:id
router.delete("/:id", deleteTaskController);

export default router;
