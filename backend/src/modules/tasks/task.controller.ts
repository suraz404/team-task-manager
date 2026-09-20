import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError.js";

import {
  getTasks,
  getTask,
  addTask,
  changeTaskStatus,
  removeTask,
} from "./task.service.js";
import { createTaskSchema } from "./task.validation.js";

// GET /api/tasks
export async function getTasksController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const userId = req.user.userId;

    const tasks = await getTasks(userId);

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/tasks/user/:userId
export async function getTasksForUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const requestedUserId = Number(req.params.userId);

    if (!Number.isInteger(requestedUserId) || requestedUserId <= 0) {
      throw new AppError("Invalid user ID", 400);
    }

    if (requestedUserId !== req.user.userId) {
      throw new AppError("You can only access your own tasks", 403);
    }

    const tasks = await getTasks(requestedUserId);

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/tasks/:id
export async function getTaskController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const userId = req.user.userId;
    const id = Number(req.params.id);

    if (isNaN(id)) {
      throw new AppError("Invalid task ID", 400);
    }

    const task = await getTask(id, userId);

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/tasks
export async function createTaskController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }
    const userId = req.user.userId;
    const task = await addTask(req.body.title, userId);

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/tasks/:id
export async function updateTaskController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const userId = req.user.userId;

    if (isNaN(id)) {
      throw new AppError("Invalid task ID", 400);
    }

    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      throw new AppError("completed must be true or false", 400);
    }

    const task = await changeTaskStatus(id, completed, userId);

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/tasks/:id
export async function deleteTaskController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const userId = req.user.userId;
    const id = Number(req.params.id);

    if (isNaN(id)) {
      throw new AppError("Invalid task ID", 400);
    }

    const task = await removeTask(id, userId);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
}
