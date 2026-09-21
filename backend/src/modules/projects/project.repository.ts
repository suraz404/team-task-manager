import pool from "../../libs/db.js";
export async function createProject(
  name: string,
  description: string | undefined,
  userId: number,
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const projectResult = await client.query(
      `INSERT INTO projects (name, description, created_by)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, userId],
    );

    const project = projectResult.rows[0];

    await client.query(
      `INSERT INTO project_members (project_id, user_id, role)
       VALUES ($1, $2, $3)`,
      [project.id, userId, "ADMIN"],
    );

    await client.query("COMMIT");

    return project;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function findUserProjects(userId: number) {
  const result = await pool.query(
    `
    SELECT projects.*
    FROM projects
    INNER JOIN project_members
      ON projects.id = project_members.project_id
    WHERE project_members.user_id = $1
    `,
    [userId],
  );

  return result.rows;
}
export async function findProjectById(projectId: number, userId: number) {
  const result = await pool.query(
    `
    SELECT projects.*
    FROM projects
    INNER JOIN project_members
      ON projects.id = project_members.project_id
    WHERE projects.id = $1
      AND project_members.user_id = $2
    `,
    [projectId, userId],
  );

  return result.rows[0];
}
