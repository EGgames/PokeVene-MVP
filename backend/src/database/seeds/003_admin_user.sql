-- =============================================================
-- Seed: 003_admin_user
-- Feature:   SPEC-004 - Cuenta administrador inicial
-- Created:   2026-04-18
-- Notes:     Idempotente — usa ON CONFLICT DO NOTHING.
--            Password: Admin2026!
-- =============================================================

INSERT INTO users (username, password_hash, role, xp, level)
SELECT 'admin',
       '$2a$10$0ZVS5eJmaq3pN9XKWrSjEuAPsu5RSdFSFbM1rpGGDKkujTAckS07y',
       'admin',
       0,
       1
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE LOWER(username) = 'admin' AND deleted_at IS NULL
);
