-- =============================================================
-- Migration: 007_alter_users_level_default_1
-- Feature:   Nivel inicial = 1 para cuentas nuevas
-- Created:   2026-04-18
-- =============================================================

-- Cambiar default de level de 0 a 1
ALTER TABLE users ALTER COLUMN level SET DEFAULT 1;

-- Actualizar usuarios existentes con level 0 a level 1
UPDATE users SET level = level + 1;
