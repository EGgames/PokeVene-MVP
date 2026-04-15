'use strict';

const fs = require('fs');
const path = require('path');
const pool = require('./connection');

const SEEDS_DIR = path.join(__dirname, 'seeds');

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

async function runSeeds() {
  const files = fs
    .readdirSync(SEEDS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const client = await pool.connect();
  try {
    for (const file of files) {
      const filePath = path.join(SEEDS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      const upSql = extractUpSection(sql);

      await client.query('BEGIN');
      try {
        await client.query(upSql);
        await client.query('COMMIT');
        console.log(`[seed] Applied: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`Seed failed for ${file}: ${err.message}`);
      }
    }

    console.log('[seed] All seeds applied successfully.');
  } finally {
    client.release();
  }
}

module.exports = runSeeds;

if (require.main === module) {
  runSeeds()
    .then(() => {
      pool.end();
      process.exit(0);
    })
    .catch((err) => {
      console.error('[seed] Error:', err.message);
      pool.end();
      process.exit(1);
    });
}
