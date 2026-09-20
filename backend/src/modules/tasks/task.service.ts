import { AppError } from "../../utils/AppError.js";
import {
  findAllTasks,
  findTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "./task.repository.js";

export async function getTasks(user_id: number) {
  return findAllTasks(user_id);
}

export async function getTask(id: number, user_id: number) {
  const task = await findTaskById(id, user_id);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
}

export async function addTask(title: string, userId: number) {
  if (title.trim() === "") {
    throw new AppError("Task title cannot be empty", 400);
  }

  return createTask(title.trim(), userId);
}

export async function changeTaskStatus(
  id: number,
  completed: boolean,
  user_id: number,
) {
  const task = await findTaskById(id, user_id);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return updateTask(id, completed, user_id);
}

export async function removeTask(id: number, user_id: number) {
  const task = await findTaskById(id, user_id);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return deleteTask(id, user_id);
}
