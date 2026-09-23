import type { Request, Response, NextFunction } from "express";

import { AppError } from "../../utils/AppError.js";
import {
  addMemberToProject,
  addProject,
  getProjectById,
  getProjectMembers,
  removeMemberFromProject,
  removeProject,
  updateMemberRole,
  updateProjectDetails,
} from "./project.services.js";
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

export async function addMemberController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const projectId = Number(req.params.projectId);
    if (Number.isNaN(projectId)) {
      throw new AppError("Invalid project ID", 400);
    }
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Authentication required", 401);
    }
    const newUserId = req.body.userId;
    const role = req.body.role;
    const data = await addMemberToProject(projectId, userId, newUserId, role);
    return res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
export async function getProjectMembersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const projectId = Number(req.params.projectId);
    const userId = req.user?.userId;

    if (Number.isNaN(projectId)) {
      throw new AppError("Invalid project ID", 400);
    }

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const members = await getProjectMembers(projectId, userId);

    return res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMemberRoleController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const projectId = Number(req.params.projectId);
    const newUserId = Number(req.params.userId);
    const currentUserId = req.user?.userId;
    const role = req.body.role;

    if (Number.isNaN(projectId) || Number.isNaN(newUserId)) {
      throw new AppError("Invalid project or user ID", 400);
    }

    if (!currentUserId) {
      throw new AppError("Authentication required", 401);
    }

    const member = await updateMemberRole(
      projectId,
      currentUserId,
      newUserId,
      role,
    );

    return res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    next(error);
  }
}
export async function removeMemberController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const projectId = Number(req.params.projectId);
    const userIdToRemove = Number(req.params.userId);
    const currentUserId = req.user?.userId;

    if (Number.isNaN(projectId) || Number.isNaN(userIdToRemove)) {
      throw new AppError("Invalid project or user ID", 400);
    }

    if (!currentUserId) {
      throw new AppError("Authentication required", 401);
    }

    const member = await removeMemberFromProject(
      projectId,
      currentUserId,
      userIdToRemove,
    );

    return res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProjectController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const projectId = Number(req.params.id);
    const currentUserId = req.user?.userId;

    if (Number.isNaN(projectId)) {
      throw new AppError("Invalid project ID", 400);
    }

    if (!currentUserId) {
      throw new AppError("Authentication required", 401);
    }

    const { name, description } = req.body;

    const project = await updateProjectDetails(
      projectId,
      currentUserId,
      name,
      description,
    );

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
}
export async function deleteProjectController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const projectId = Number(req.params.id);
    const currentUserId = req.user?.userId;

    if (Number.isNaN(projectId)) {
      throw new AppError("Invalid project ID", 400);
    }

    if (!currentUserId) {
      throw new AppError("Authentication required", 401);
    }

    const project = await removeProject(projectId, currentUserId);

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
}
