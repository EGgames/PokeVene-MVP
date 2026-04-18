-- =============================================================
-- Migration: 006_create_settings_table
-- Feature:   SPEC-004 - Sistema de Administración, Dashboard, Niveles y Sugerencias
-- Created:   2026-04-18
-- Author:    database-agent
-- =============================================================

-- ============================================================
-- UP
-- ============================================================

CREATE TABLE IF NOT EXISTS settings (
  key        VARCHAR(100) NOT NULL,
  value      VARCHAR(255) NOT NULL,
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_by UUID         NULL,

  CONSTRAINT settings_pkey
    PRIMARY KEY (key),

  CONSTRAINT settings_updated_by_fkey
    FOREIGN KEY (updated_by) REFERENCES users (id)
);


-- ============================================================
-- DOWN  (ejecutar manualmente para revertir)
-- ============================================================

-- DROP TABLE IF EXISTS settings;
