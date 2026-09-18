import { AppError } from "../../utils/AppError.js";
import {
  findAllTasks,
  findTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "./task.repository.js";

export async function getTasks() {
  return findAllTasks();
}

export async function getTask(id: number) {
  const task = await findTaskById(id);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
}

export async function addTask(title: string) {
  if (title.trim() === "") {
    throw new AppError("Task title cannot be empty", 400);
  }

  return createTask(title.trim());
}

export async function changeTaskStatus(id: number, completed: boolean) {
  const task = await findTaskById(id);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return updateTask(id, completed);
}

export async function removeTask(id: number) {
  const task = await findTaskById(id);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return deleteTask(id);
}
