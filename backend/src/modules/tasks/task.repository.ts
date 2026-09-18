import pool from "../../libs/db.js";

// Get all tasks
export async function findAllTasks() {
  const result = await pool.query("SELECT * FROM tasks ORDER BY id");

  return result.rows;
}

// Get one task
export async function findTaskById(id: number) {
  const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);

  return result.rows[0];
}

// Create task
export async function createTask(title: string) {
  const result = await pool.query(
    `INSERT INTO tasks (title, completed)
     VALUES ($1, $2)
     RETURNING *`,
    [title, false],
  );

  return result.rows[0];
}

// Update task
export async function updateTask(id: number, completed: boolean) {
  const result = await pool.query(
    `UPDATE tasks
     SET completed = $1
     WHERE id = $2
     RETURNING *`,
    [completed, id],
  );

  return result.rows[0];
}

// Delete task
export async function deleteTask(id: number) {
  const result = await pool.query(
    `DELETE FROM tasks
     WHERE id = $1
     RETURNING *`,
    [id],
  );

  return result.rows[0];
}
