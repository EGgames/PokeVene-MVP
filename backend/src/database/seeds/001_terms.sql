-- =============================================================
-- Seed: 001_terms
-- Feature:   SPEC-003 - Gameplay "Pokémon o Venezolano"
-- Created:   2026-04-15
-- Author:    database-agent
-- Notes:     Idempotente — usa INSERT ... ON CONFLICT DO NOTHING.
--            Requiere que la tabla `terms` exista (002_create_terms_table.sql).
-- =============================================================

-- ============================================================
-- UP  (insertar datos semilla)
-- ============================================================

INSERT INTO terms (text, category) VALUES
  -- ── Pokémon (50 términos de diferentes generaciones) ──────────────────────
  ('Charmander',   'pokemon'),
  ('Pikachu',      'pokemon'),
  ('Bulbasaur',    'pokemon'),
  ('Squirtle',     'pokemon'),
  ('Jigglypuff',   'pokemon'),
  ('Eevee',        'pokemon'),
  ('Mewtwo',       'pokemon'),
  ('Gengar',       'pokemon'),
  ('Onix',         'pokemon'),
  ('Snorlax',      'pokemon'),
  ('Geodude',      'pokemon'),
  ('Machop',       'pokemon'),
  ('Diglett',      'pokemon'),
  ('Psyduck',      'pokemon'),
  ('Caterpie',     'pokemon'),
  ('Weedle',       'pokemon'),
  ('Rattata',      'pokemon'),
  ('Pidgey',       'pokemon'),
  ('Zubat',        'pokemon'),
  ('Abra',         'pokemon'),
  ('Kadabra',      'pokemon'),
  ('Dragonite',    'pokemon'),
  ('Lapras',       'pokemon'),
  ('Togepi',       'pokemon'),
  ('Marill',       'pokemon'),
  ('Wobbuffet',    'pokemon'),
  ('Mudkip',       'pokemon'),
  ('Torchic',      'pokemon'),
  ('Gardevoir',    'pokemon'),
  ('Flygon',       'pokemon'),
  ('Lucario',      'pokemon'),
  ('Garchomp',     'pokemon'),
  ('Toxicroak',    'pokemon'),
  ('Mimikyu',      'pokemon'),
  ('Rowlet',       'pokemon'),
  ('Litten',       'pokemon'),
  ('Popplio',      'pokemon'),
  ('Wooloo',       'pokemon'),
  ('Corviknight',  'pokemon'),
  ('Ditto',        'pokemon'),
  ('Magikarp',     'pokemon'),
  ('Gyarados',     'pokemon'),
  ('Alakazam',     'pokemon'),
  ('Haunter',      'pokemon'),
  ('Clefairy',     'pokemon'),
  ('Vulpix',       'pokemon'),
  ('Growlithe',    'pokemon'),
  ('Poliwag',      'pokemon'),
  ('Oddish',       'pokemon'),
  ('Bellsprout',   'pokemon'),

  -- ── Venezolano (50 términos: jerga, comida, expresiones, lugares) ─────────
  ('Arepa',        'venezolano'),
  ('Cachapa',      'venezolano'),
  ('Hallaca',      'venezolano'),
  ('Tequeño',      'venezolano'),
  ('Pabellón',     'venezolano'),
  ('Guarapo',      'venezolano'),
  ('Papelón',      'venezolano'),
  ('Chimó',        'venezolano'),
  ('Chamo',        'venezolano'),
  ('Catire',       'venezolano'),
  ('Sifrino',      'venezolano'),
  ('Pana',         'venezolano'),
  ('Marico',       'venezolano'),
  ('Burda',        'venezolano'),
  ('Ladilla',      'venezolano'),
  ('Gafo',         'venezolano'),
  ('Cambur',       'venezolano'),
  ('Lechosa',      'venezolano'),
  ('Guayoyo',      'venezolano'),
  ('Morocho',      'venezolano'),
  ('Patacón',      'venezolano'),
  ('Mandoca',      'venezolano'),
  ('Golfeado',     'venezolano'),
  ('Cachito',      'venezolano'),
  ('Fosforera',    'venezolano'),
  ('Perolita',     'venezolano'),
  ('Chuzo',        'venezolano'),
  ('Güevón',       'venezolano'),
  ('Coroto',       'venezolano'),
  ('Corotico',     'venezolano'),
  ('Chévere',      'venezolano'),
  ('Chola',        'venezolano'),
  ('Tusera',       'venezolano'),
  ('Macundales',   'venezolano'),
  ('Mecate',       'venezolano'),
  ('Cocuy',        'venezolano'),
  ('Pasticho',     'venezolano'),
  ('Birra',        'venezolano'),
  ('Gandola',      'venezolano'),
  ('Cotufa',       'venezolano'),
  ('Pavita',       'venezolano'),
  ('Zamuro',       'venezolano'),
  ('Cuaima',       'venezolano'),
  ('Sapoara',      'venezolano'),
  ('Bochinche',    'venezolano'),
  ('Perico',       'venezolano'),
  ('Bachaco',      'venezolano'),
  ('Taguara',      'venezolano'),
  ('Palmarejo',    'venezolano'),
  ('Guacharo',     'venezolano')

ON CONFLICT (text) DO NOTHING;


-- ============================================================
-- DOWN  (eliminar solo los datos insertados por este seed)
-- ============================================================

-- DELETE FROM terms WHERE text IN (
--   'Charmander','Pikachu','Bulbasaur','Squirtle','Jigglypuff','Eevee','Mewtwo',
--   'Gengar','Onix','Snorlax','Geodude','Machop','Diglett','Psyduck','Caterpie',
--   'Weedle','Rattata','Pidgey','Zubat','Abra','Kadabra','Dragonite','Lapras',
--   'Togepi','Marill','Wobbuffet','Mudkip','Torchic','Gardevoir','Flygon',
--   'Lucario','Garchomp','Toxicroak','Mimikyu','Rowlet','Litten','Popplio',
--   'Wooloo','Corviknight','Ditto','Magikarp','Gyarados','Alakazam','Haunter',
--   'Clefairy','Vulpix','Growlithe','Poliwag','Oddish','Bellsprout',
--   'Arepa','Cachapa','Hallaca','Tequeño','Pabellón','Guarapo','Papelón',
--   'Chimó','Chamo','Catire','Sifrino','Pana','Marico','Burda','Ladilla',
--   'Gafo','Cambur','Lechosa','Guayoyo','Morocho','Patacón','Mandoca',
--   'Golfeado','Cachito','Fosforera','Perolita','Chuzo','Güevón','Coroto',
--   'Corotico','Chévere','Chola','Tusera','Macundales','Mecate','Cocuy',
--   'Pasticho','Birra','Gandola','Cotufa','Pavita','Zamuro','Cuaima',
--   'Sapoara','Bochinche','Perico','Bachaco','Taguara','Palmarejo','Guacharo'
-- );
