// Repository: Acceso a DB para la tabla settings — sin lógica de negocio (SPEC-004)

class SettingsRepository {
  constructor(pool) {
    this.pool = pool;
  }

  /**
   * Retorna todos los settings como objeto { key: value }.
   * @returns {Promise<object>}
   */
  async getAll() {
    const result = await this.pool.query(`SELECT key, value FROM settings`);
    return result.rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
  }

  /**
   * Retorna el value de un setting por key, o null si no existe.
   * @param {string} key
   * @returns {Promise<string|null>}
   */
  async get(key) {
    const result = await this.pool.query(
      `SELECT value FROM settings WHERE key = $1`,
      [key]
    );
    return result.rows[0] ? result.rows[0].value : null;
  }

  /**
   * Inserta o actualiza un setting (upsert por key).
   * @param {string} key
   * @param {string} value
   * @param {string|null} updatedBy - UUID del admin que actualiza
   * @returns {Promise<object>}
   */
  async set(key, value, updatedBy) {
    const result = await this.pool.query(
      `INSERT INTO settings (key, value, updated_at, updated_by)
       VALUES ($1, $2, NOW(), $3)
       ON CONFLICT (key) DO UPDATE
         SET value = EXCLUDED.value,
             updated_at = NOW(),
             updated_by = EXCLUDED.updated_by
       RETURNING key, value, updated_at`,
      [key, value, updatedBy]
    );
    return result.rows[0];
  }
}

module.exports = SettingsRepository;
