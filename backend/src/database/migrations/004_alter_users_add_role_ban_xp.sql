-- =============================================================
-- Migration: 004_alter_users_add_role_ban_xp
-- Feature:   SPEC-004 - Sistema de Administración, Dashboard, Niveles y Sugerencias
-- Created:   2026-04-18
-- Author:    database-agent
-- =============================================================

-- ============================================================
-- UP
-- ============================================================

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role      VARCHAR(10)  NOT NULL DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS banned_at TIMESTAMPTZ  NULL,
  ADD COLUMN IF NOT EXISTS xp        INTEGER      NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS level     INTEGER      NOT NULL DEFAULT 0;

ALTER TABLE users
  ADD CONSTRAINT users_role_check
    CHECK (role IN ('user', 'admin')),

  ADD CONSTRAINT users_xp_check
    CHECK (xp >= 0),

  ADD CONSTRAINT users_level_check
    CHECK (level >= 0);

-- Índice sobre role para filtrar administradores eficientemente (SPEC-004 sección Índices).
CREATE INDEX IF NOT EXISTS users_role_idx
  ON users (role);


-- ============================================================
-- DOWN  (ejecutar manualmente para revertir)
-- ============================================================

-- DROP INDEX IF EXISTS users_role_idx;
-- ALTER TABLE users
--   DROP CONSTRAINT IF EXISTS users_level_check,
--   DROP CONSTRAINT IF EXISTS users_xp_check,
--   DROP CONSTRAINT IF EXISTS users_role_check,
--   DROP COLUMN IF EXISTS level,
--   DROP COLUMN IF EXISTS xp,
--   DROP COLUMN IF EXISTS banned_at,
--   DROP COLUMN IF EXISTS role;
