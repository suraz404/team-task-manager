import type { Request, Response, NextFunction } from "express";

import { AppError } from "../../utils/AppError.js";
import { addProject, getProjectById } from "./project.services.js";
import { getUserProjects } from "./project.services.js";

export async function createProjectController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, description } = req.body;

    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const project = await addProject(name, description, userId);

    return res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProjectsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Authentication required", 401);
    }
    const projects = await getUserProjects(userId);
    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
}

export async function getProjectsControllerById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const projectId = Number(req.params.id);
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Authentication required", 401);
    }
    const project = await getProjectById(projectId, userId);
    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}
