'use strict';
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const pool = require('./connection');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
const MIGRATIONS_TABLE = '_migrations';

/**
 * Extrae la sección UP de un archivo SQL.
 * Busca la línea que comienza con "-- UP" y retorna el contenido
 * hasta la línea que comienza con "-- DOWN" o hasta el fin del archivo.
 * Si no hay marcador UP, retorna el contenido completo.
 */
function extractUpSection(sql) {
  const lines = sql.split('\n');
  let upStart = -1;
  let downStart = -1;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (/^--\s*UP(\s|$)/i.test(trimmed) && upStart === -1) {
      upStart = i + 1;
    } else if (/^--\s*DOWN(\s|$)/i.test(trimmed) && upStart !== -1) {
      downStart = i;
      break;
    }
  }

  if (upStart === -1) {
    return sql;
  }

  const upLines = downStart === -1 ? lines.slice(upStart) : lines.slice(upStart, downStart);
  return upLines.join('\n').trim();
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id         SERIAL       PRIMARY KEY,
      filename   VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `);
}

async function getAppliedMigrations(client) {
  const result = await client.query(`SELECT filename FROM ${MIGRATIONS_TABLE}`);
  return new Set(result.rows.map((r) => r.filename));
}

async function runMigrations() {
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const client = await pool.connect();
  try {
    await ensureMigrationsTable(client);
    const applied = await getAppliedMigrations(client);

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`[migrate] Skipping (already applied): ${file}`);
        continue;
      }

      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      const upSql = extractUpSection(sql);

      await client.query('BEGIN');
      try {
        await client.query(upSql);
        await client.query(`INSERT INTO ${MIGRATIONS_TABLE} (filename) VALUES ($1)`, [file]);
        await client.query('COMMIT');
        console.log(`[migrate] Applied: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`Migration failed for ${file}: ${err.message}`);
      }
    }

    console.log('[migrate] All migrations applied successfully.');
  } finally {
    client.release();
  }
}

module.exports = runMigrations;

if (require.main === module) {
  runMigrations()
    .then(() => {
      pool.end();
      process.exit(0);
    })
    .catch((err) => {
      console.error('[migrate] Error:', err.message);
      pool.end();
      process.exit(1);
    });
}
