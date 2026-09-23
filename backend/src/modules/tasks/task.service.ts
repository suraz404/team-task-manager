import { AppError } from "../../utils/AppError.js";

import {
  requireProjectMember,
  requireProjectRole,
} from "../projects/project.services.js";

import {
  findAllTasks,
  findTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "./task.repository.js";

export async function getTasks(projectId: number, userId: number) {
  await requireProjectRole(projectId, userId, ["ADMIN", "MANAGER", "MEMBER"]);

  return findAllTasks(projectId);
}

export async function getTask(id: number, projectId: number, userId: number) {
  await requireProjectRole(projectId, userId, ["ADMIN", "MANAGER", "MEMBER"]);

  const task = await findTaskById(id, projectId);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
}

export async function addTask(
  title: string,
  projectId: number,
  createdBy: number,
  assignedTo?: number | null,
) {
  if (title.trim() === "") {
    throw new AppError("Task title cannot be empty", 400);
  }

  // Make sure the creator belongs to the project
  await requireProjectMember(projectId, createdBy);

  // If a task is being assigned,
  // make sure the assignee belongs to the same project
  if (assignedTo !== undefined && assignedTo !== null) {
    await requireProjectMember(projectId, assignedTo);
  }

  return createTask(title.trim(), projectId, createdBy, assignedTo);
}

export async function changeTaskStatus(
  id: number,
  completed: boolean,
  projectId: number,
  userId: number,
) {
  await requireProjectMember(projectId, userId);

  const task = await findTaskById(id, projectId);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return updateTask(id, completed, projectId);
}

export async function removeTask(
  id: number,
  projectId: number,
  userId: number,
) {
  // Only ADMIN and MANAGER can delete tasks
  await requireProjectRole(projectId, userId, ["ADMIN", "MANAGER"]);

  const task = await findTaskById(id, projectId);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return deleteTask(id, projectId);
}
