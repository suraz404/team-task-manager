import type { Request, Response, NextFunction } from "express";

import { AppError } from "../../utils/AppError.js";

import {
  getTasks,
  getTask,
  addTask,
  changeTaskStatus,
  removeTask,
} from "./task.service.js";

type AuthenticatedRequest = Request & {
  user?: {
    userId: number;
  };
};

// GET /api/projects/:projectId/tasks
export async function getTasksController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const userId = req.user.userId;
    const projectId = Number(req.params.projectId);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      throw new AppError("Invalid project ID", 400);
    }

    const tasks = await getTasks(projectId, userId);

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/projects/:projectId/tasks/:id
export async function getTaskController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const userId = req.user.userId;
    const projectId = Number(req.params.projectId);
    const id = Number(req.params.id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      throw new AppError("Invalid project ID", 400);
    }

    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError("Invalid task ID", 400);
    }

    const task = await getTask(id, projectId, userId);

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/projects/:projectId/tasks
export async function createTaskController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const projectId = Number(req.params.projectId);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      throw new AppError("Invalid project ID", 400);
    }

    const userId = req.user.userId;

    const task = await addTask(
      req.body.title,
      projectId,
      userId,
      req.body.assignedTo,
    );

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/projects/:projectId/tasks/:id
export async function updateTaskController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const userId = req.user.userId;
    const projectId = Number(req.params.projectId);
    const id = Number(req.params.id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      throw new AppError("Invalid project ID", 400);
    }

    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError("Invalid task ID", 400);
    }

    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      throw new AppError("completed must be true or false", 400);
    }

    const task = await changeTaskStatus(id, completed, projectId, userId);

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/projects/:projectId/tasks/:id
export async function deleteTaskController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const userId = req.user.userId;
    const projectId = Number(req.params.projectId);
    const id = Number(req.params.id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      throw new AppError("Invalid project ID", 400);
    }

    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError("Invalid task ID", 400);
    }

    const task = await removeTask(id, projectId, userId);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
}
