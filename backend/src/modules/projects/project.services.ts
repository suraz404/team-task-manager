import { AppError } from "../../utils/AppError.js";
import {
  addProjectMember,
  createProject,
  deleteProject,
  findProjectById,
  findProjectMemberRole,
  removeProjectMember,
  updateProject,
  updateProjectMemberRole,
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

export async function updateMemberRole(
  projectId: number,
  currentUserId: number,
  newUserId: number,
  role: ProjectRole,
) {
  await requireProjectAdmin(projectId, currentUserId);

  const member = await updateProjectMemberRole(projectId, newUserId, role);

  if (!member) {
    throw new AppError("Project member not found", 404);
  }

  return member;
}

export async function removeMemberFromProject(
  projectId: number,
  currentUserId: number,
  userIdToRemove: number,
) {
  await requireProjectAdmin(projectId, currentUserId);

  if (currentUserId === userIdToRemove) {
    throw new AppError("You cannot remove yourself from the project", 400);
  }

  const member = await removeProjectMember(projectId, userIdToRemove);

  if (!member) {
    throw new AppError("Project member not found", 404);
  }

  return member;
}

export async function updateProjectDetails(
  projectId: number,
  currentUserId: number,
  name: string | undefined,
  description: string | undefined,
) {
  await requireProjectAdmin(projectId, currentUserId);

  const project = await updateProject(projectId, name, description);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
}
export async function removeProject(projectId: number, currentUserId: number) {
  await requireProjectAdmin(projectId, currentUserId);

  const project = await deleteProject(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
}
