-- =============================================================
-- Migration: 003_create_scores_table
-- Feature:   SPEC-003 - Gameplay "Pokémon o Venezolano"
-- Created:   2026-04-15
-- Author:    database-agent
-- =============================================================

-- ============================================================
-- UP
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS scores (
  id                UUID   NOT NULL DEFAULT uuid_generate_v4(),
  user_id           UUID   NOT NULL,
  score_percentage  REAL   NOT NULL,
  terms_answered    INTEGER NOT NULL,
  correct_count     INTEGER NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT scores_pkey
    PRIMARY KEY (id),

  -- FK hacia users (SPEC-003 sección "Tabla: scores")
  CONSTRAINT scores_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id),

  -- Porcentaje entre 0 y 100 (SPEC-003 RN-04)
  CONSTRAINT scores_score_percentage_range
    CHECK (score_percentage >= 0 AND score_percentage <= 100),

  -- Al menos una pregunta respondida
  CONSTRAINT scores_terms_answered_positive
    CHECK (terms_answered > 0),

  -- No puede haber más aciertos que preguntas respondidas
  CONSTRAINT scores_correct_count_non_negative
    CHECK (correct_count >= 0),

  -- Integridad lógica: aciertos <= total preguntas (SPEC-003 RN-05)
  CONSTRAINT scores_correct_lte_answered
    CHECK (correct_count <= terms_answered)
);

-- Índice para búsqueda de puntajes por usuario (SPEC-003 sección "Índices")
CREATE INDEX IF NOT EXISTS scores_user_id_idx
  ON scores (user_id);

-- Índice para ordenamiento del leaderboard (descendente) (SPEC-003 sección "Índices")
CREATE INDEX IF NOT EXISTS scores_score_percentage_idx
  ON scores (score_percentage DESC);

-- Índice para análisis temporal (SPEC-003 sección "Índices")
CREATE INDEX IF NOT EXISTS scores_created_at_idx
  ON scores (created_at DESC);


-- ============================================================
-- DOWN  (ejecutar manualmente para revertir)
-- ============================================================

-- DROP INDEX IF EXISTS scores_created_at_idx;
-- DROP INDEX IF EXISTS scores_score_percentage_idx;
-- DROP INDEX IF EXISTS scores_user_id_idx;
-- DROP TABLE IF EXISTS scores;
