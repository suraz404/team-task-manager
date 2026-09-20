import pool from "../../libs/db.js";

// Get all tasks
export async function findAllTasks(user_id: number) {
  const result = await pool.query(
    `SELECT * FROM tasks
    WHERE user_id = $1
    ORDER BY id;`,
    [user_id],
  );

  return result.rows;
}

// Get one task
export async function findTaskById(id: number, user_id: number) {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
    [id, user_id],
  );

  return result.rows[0];
}

// Create task
export async function createTask(title: string, userId: number) {
  const result = await pool.query(
    `INSERT INTO tasks (title, completed,user_id)
     VALUES ($1, $2 ,$3)
     RETURNING *`,
    [title, false, userId],
  );

  return result.rows[0];
}

// Update task
export async function updateTask(
  id: number,
  completed: boolean,
  userId: number,
) {
  const result = await pool.query(
    `UPDATE tasks
SET completed = $1
WHERE id = $2
AND user_id = $3
RETURNING *;`,
    [completed, id, userId],
  );

  return result.rows[0];
}

// Delete task
export async function deleteTask(id: number, user_id: number) {
  const result = await pool.query(
    `DELETE FROM tasks
     WHERE id = $1
     AND user_id = $2
     RETURNING *`,
    [id, user_id],
  );

  return result.rows[0];
}
