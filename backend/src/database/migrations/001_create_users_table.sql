-- =============================================================
-- Migration: 001_create_users_table
-- Feature:   SPEC-002 - Autenticación de Usuarios (Backend JWT)
-- Created:   2026-04-14
-- Author:    database-agent
-- =============================================================

-- ============================================================
-- UP
-- ============================================================

-- Habilitar extensión UUID (disponible en PostgreSQL >= 13 via gen_random_uuid,
-- se usa uuid-ossp para compatibilidad con versiones < 13).
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id            UUID         NOT NULL DEFAULT uuid_generate_v4(),
  username      VARCHAR(20)  NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ  NULL,

  CONSTRAINT users_pkey
    PRIMARY KEY (id),

  -- Username: mínimo 3, máximo 20 caracteres (LIN-DEV-012 constraints obligatorios)
  CONSTRAINT users_username_length
    CHECK (LENGTH(username) >= 3 AND LENGTH(username) <= 20),

  -- Username: solo caracteres alfanuméricos, guiones y guiones bajos (SPEC-002 RN-01)
  CONSTRAINT users_username_format
    CHECK (username ~ '^[a-zA-Z0-9_\-]+$'),

  -- Bcrypt genera hashes de mínimo 60 caracteres (SPEC-002 RN-04)
  CONSTRAINT users_password_hash_min_length
    CHECK (LENGTH(password_hash) >= 60)
);

-- Índice único case-insensitive sobre username (SPEC-002 RN-03).
-- Índice parcial: los usuarios con soft-delete liberan su username.
CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique
  ON users (LOWER(username))
  WHERE deleted_at IS NULL;

-- Índice sobre created_at para consultas de analytics (SPEC-002 sección Índices).
CREATE INDEX IF NOT EXISTS users_created_at_idx
  ON users (created_at);

-- Índice sobre deleted_at para filtrar usuarios activos eficientemente (LIN-DEV-012).
CREATE INDEX IF NOT EXISTS users_deleted_at_idx
  ON users (deleted_at)
  WHERE deleted_at IS NOT NULL;


-- ============================================================
-- DOWN  (ejecutar manualmente para revertir)
-- ============================================================

-- DROP INDEX IF EXISTS users_deleted_at_idx;
-- DROP INDEX IF EXISTS users_created_at_idx;
-- DROP INDEX IF EXISTS users_username_unique;
-- DROP TABLE IF EXISTS users;
-- DROP EXTENSION IF EXISTS "uuid-ossp";
