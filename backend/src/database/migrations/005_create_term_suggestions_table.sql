-- =============================================================
-- Migration: 005_create_term_suggestions_table
-- Feature:   SPEC-004 - Sistema de Administración, Dashboard, Niveles y Sugerencias
-- Created:   2026-04-18
-- Author:    database-agent
-- =============================================================

-- ============================================================
-- UP
-- ============================================================

CREATE TABLE IF NOT EXISTS term_suggestions (
  id          UUID         NOT NULL DEFAULT uuid_generate_v4(),
  user_id     UUID         NOT NULL,
  text        VARCHAR(100) NOT NULL,
  category    VARCHAR(20)  NOT NULL,
  status      VARCHAR(20)  NOT NULL DEFAULT 'pending',
  reviewed_by UUID         NULL,
  review_note VARCHAR(255) NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT term_suggestions_pkey
    PRIMARY KEY (id),

  CONSTRAINT term_suggestions_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id),

  CONSTRAINT term_suggestions_reviewed_by_fkey
    FOREIGN KEY (reviewed_by) REFERENCES users (id),

  -- Categoría: solo valores permitidos (SPEC-004 Modelos de Datos)
  CONSTRAINT term_suggestions_category_check
    CHECK (category IN ('pokemon', 'venezolano')),

  -- Estado: solo valores permitidos (SPEC-004 Modelos de Datos)
  CONSTRAINT term_suggestions_status_check
    CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Índice sobre status para listar sugerencias pendientes eficientemente (SPEC-004 sección Índices).
CREATE INDEX IF NOT EXISTS term_suggestions_status_idx
  ON term_suggestions (status);

-- Índice sobre user_id para listar sugerencias por usuario (SPEC-004 sección Índices).
CREATE INDEX IF NOT EXISTS term_suggestions_user_id_idx
  ON term_suggestions (user_id);

-- UNIQUE parcial: no se permiten dos sugerencias del mismo texto en estado 'pending' (SPEC-004 RN-09).
CREATE UNIQUE INDEX IF NOT EXISTS term_suggestions_text_pending_unique
  ON term_suggestions (LOWER(text))
  WHERE status = 'pending';


-- ============================================================
-- DOWN  (ejecutar manualmente para revertir)
-- ============================================================

-- DROP INDEX IF EXISTS term_suggestions_text_pending_unique;
-- DROP INDEX IF EXISTS term_suggestions_user_id_idx;
-- DROP INDEX IF EXISTS term_suggestions_status_idx;
-- DROP TABLE IF EXISTS term_suggestions;
