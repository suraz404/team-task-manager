import { AppError } from "../../utils/AppError.js";
import { createProject, findProjectById } from "./project.repository.js";

export async function addProject(
  name: string,
  description: string | undefined,
  userId: number,
) {
  return createProject(name, description, userId);
}
import { findUserProjects } from "./project.repository.js";
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
