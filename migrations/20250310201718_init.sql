-- Add migration script here
-- Create users table.
CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);
-- Add test user
INSERT INTO users
  (id, username, password)
VALUES
  ( 1, 'asdf', '$argon2id$v=19$m=19456,t=2,p=1$ZozkftHP1V2raRCeGl3H0g$LxY2W1bsOy7vJOMVsxpDplmao7LlMZnD05TcLMn4x8c');
