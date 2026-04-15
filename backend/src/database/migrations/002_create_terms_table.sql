-- =============================================================
-- Migration: 002_create_terms_table
-- Feature:   SPEC-003 - Gameplay "Pokémon o Venezolano"
-- Created:   2026-04-15
-- Author:    database-agent
-- =============================================================

-- ============================================================
-- UP
-- ============================================================

-- La extensión uuid-ossp ya fue habilitada en 001_create_users_table.
-- Se incluye IF NOT EXISTS por seguridad ante ejecuciones independientes.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS terms (
  id          UUID         NOT NULL DEFAULT uuid_generate_v4(),
  text        VARCHAR(100) NOT NULL,
  category    VARCHAR(20)  NOT NULL,
  difficulty  VARCHAR(20)  NOT NULL DEFAULT 'normal',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT terms_pkey
    PRIMARY KEY (id),

  -- Cada término es único (SPEC-003 sección "Tabla: terms")
  CONSTRAINT terms_text_unique
    UNIQUE (text),

  -- Solo dos categorías válidas (SPEC-003 RN-04)
  CONSTRAINT terms_category_check
    CHECK (category IN ('pokemon', 'venezolano'))
);

-- Índice para filtrado de términos por categoría (SPEC-003 sección "Índices")
CREATE INDEX IF NOT EXISTS terms_category_idx
  ON terms (category);

-- Índice auxiliar sobre text para búsquedas exactas (SPEC-003 sección "Índices")
CREATE INDEX IF NOT EXISTS terms_text_idx
  ON terms (text);


-- ============================================================
-- DOWN  (ejecutar manualmente para revertir)
-- ============================================================

-- DROP INDEX IF EXISTS terms_text_idx;
-- DROP INDEX IF EXISTS terms_category_idx;
-- DROP TABLE IF EXISTS terms;
