import { AppError } from "../../utils/AppError.js";
import {
  addProjectMember,
  createProject,
  findProjectById,
  findProjectMemberRole,
} from "./project.repository.js";
import { findProjectMembers } from "./project.repository.js";
export async function addProject(
  name: string,
  description: string | undefined,
  userId: number,
) {
  return createProject(name, description, userId);
}
import { findUserProjects } from "./project.repository.js";
import type { ProjectRole } from "./project.type.js";
export async function getUserProjects(userId: number) {
  return findUserProjects(userId);
}
export async function getProjectById(projectId: number, userId: number) {
  const project = await findProjectById(projectId, userId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
}
export async function requireProjectAdmin(projectId: number, userId: number) {
  const membership = await findProjectMemberRole(projectId, userId);

  if (!membership) {
    throw new AppError("Project not found", 404);
  }

  if (membership.role !== "ADMIN") {
    throw new AppError(
      "You do not have permission to perform this action",
      403,
    );
  }

  return membership;
}
export async function addMemberToProject(
  projectId: number,
  currentUserId: number,
  newUserId: number,
  role: ProjectRole,
) {
  await requireProjectAdmin(projectId, currentUserId);

  return addProjectMember(projectId, newUserId, role);
}
export async function getProjectMembers(
  projectId: number,
  currentUserId: number,
) {
  const membership = await findProjectMemberRole(projectId, currentUserId);

  if (!membership) {
    throw new AppError("Project not found", 404);
  }

  return findProjectMembers(projectId);
}
