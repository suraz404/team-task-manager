ALTER TABLE tasks
ADD COLUMN created_by INTEGER
REFERENCES users(id);

UPDATE tasks
SET created_by = user_id
WHERE user_id IS NOT NULL;