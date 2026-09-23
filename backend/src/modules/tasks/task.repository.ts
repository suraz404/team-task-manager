import pool from "../../libs/db.js";

// Get all tasks
export async function findAllTasks(projectId: number) {
  const result = await pool.query(
    `SELECT * FROM tasks
    WHERE project_id = $1
    ORDER BY id;`,
    [projectId],
  );

  return result.rows;
}

// Get one task
export async function findTaskById(id: number, projectId: number) {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE id = $1 AND project_id = $2",
    [id, projectId],
  );

  return result.rows[0];
}

// Create task
export async function createTask(
  title: string,
  projectId: number,
  createdBy: number,
  assignedTo?: number | null,
) {
  const result = await pool.query(
    `
    INSERT INTO tasks (
      title,
      completed,
      project_id,
      created_by,
      assigned_to
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [title, false, projectId, createdBy, assignedTo ?? null],
  );

  return result.rows[0];
}

// Update task
export async function updateTask(
  id: number,
  completed: boolean,
  projectId: number,
) {
  const result = await pool.query(
    `
    UPDATE tasks
    SET completed = $1
    WHERE id = $2
      AND project_id = $3
    RETURNING *;
    `,
    [completed, id, projectId],
  );

  return result.rows[0];
}

// Delete task
export async function deleteTask(id: number, projectId: number) {
  const result = await pool.query(
    `
    DELETE FROM tasks
    WHERE id = $1
      AND project_id = $2
    RETURNING *;
    `,
    [id, projectId],
  );

  return result.rows[0];
}
