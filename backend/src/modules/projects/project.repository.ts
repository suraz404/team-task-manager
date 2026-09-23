import pool from "../../libs/db.js";
import type { ProjectRole } from "./project.type.js";
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
export async function findProjectMemberRole(projectId: number, userId: number) {
  const result = await pool.query(
    `
    SELECT role
    FROM project_members
    WHERE project_id = $1
      AND user_id = $2
    `,
    [projectId, userId],
  );

  return result.rows[0];
}

export async function addProjectMember(
  projectId: number,
  userId: number,
  role: string,
) {
  const result = await pool.query(
    `
    INSERT INTO project_members (
      project_id,
      user_id,
      role
    )
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [projectId, userId, role],
  );

  return result.rows[0];
}
export async function findProjectMembers(projectId: number) {
  const result = await pool.query(
    `
    SELECT
      users.id,
      users.email,
      project_members.role
    FROM users
    INNER JOIN project_members
      ON users.id = project_members.user_id
    WHERE project_members.project_id = $1
    `,
    [projectId],
  );

  return result.rows;
}

export async function updateProjectMemberRole(
  projectId: number,
  userId: number,
  role: ProjectRole,
) {
  const result = await pool.query(
    `UPDATE project_members
SET role = $1
WHERE project_id = $2 
  AND user_id =$3
RETURNING *;`,
    [role, projectId, userId],
  );

  return result.rows;
}
export async function removeProjectMember(projectId: number, userId: number) {
  const result = await pool.query(
    `
    DELETE FROM project_members
    WHERE project_id = $1
      AND user_id = $2
    RETURNING *;
    `,
    [projectId, userId],
  );

  return result.rows[0];
}
export async function updateProject(
  projectId: number,
  name: string | undefined,
  description: string | undefined,
) {
  const result = await pool.query(
    `
    UPDATE projects
    SET
      name = COALESCE($1, name),
      description = COALESCE($2, description)
    WHERE id = $3
    RETURNING *;
    `,
    [name, description, projectId],
  );

  return result.rows[0];
}
export async function deleteProject(projectId: number) {
  const result = await pool.query(
    `
    DELETE FROM projects
    WHERE id = $1
    RETURNING *;
    `,
    [projectId],
  );

  return result.rows[0];
}
