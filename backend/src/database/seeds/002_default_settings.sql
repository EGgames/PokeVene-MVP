-- =============================================================
-- Seed: 002_default_settings
-- Feature:   SPEC-004 - Sistema de Administración, Dashboard, Niveles y Sugerencias
-- Created:   2026-04-18
-- Author:    database-agent
-- Notes:     Idempotente — usa INSERT ... ON CONFLICT DO NOTHING.
--            Requiere que la tabla `settings` exista (006_create_settings_table.sql).
-- =============================================================

-- ============================================================
-- UP  (insertar datos semilla)
-- ============================================================

INSERT INTO settings (key, value) VALUES
  ('suggestion_level_threshold', '10')
ON CONFLICT DO NOTHING;


-- ============================================================
-- DOWN  (ejecutar manualmente para revertir)
-- ============================================================

-- DELETE FROM settings WHERE key = 'suggestion_level_threshold';
