// Repository: Acceso a DB para la entidad Term — sin lógica de negocio (SPEC-003, SPEC-004)

class TermRepository {
  constructor(pool) {
    this.pool = pool;
  }

  /**
   * Obtiene un término aleatorio excluyendo los IDs indicados.
   * @param {string[]} exclude_ids - UUIDs a excluir (puede ser vacío)
   * @returns {Promise<{ id, text, category }|null>}
   */
  async getRandomTerm(exclude_ids = []) {
    const result = await this.pool.query(
      `SELECT id, text, category
       FROM terms
       WHERE id != ALL($1::uuid[])
       ORDER BY RANDOM()
       LIMIT 1`,
      [exclude_ids]
    );
    return result.rows[0] || null;
  }

  /**
   * Obtiene N términos aleatorios excluyendo los IDs indicados.
   * @param {number} count - Cantidad de términos a retornar
   * @param {string[]} exclude_ids - UUIDs a excluir (puede ser vacío)
   * @returns {Promise<Array<{ id, text, category }>>}
   */
  async getRandomTerms(count = 10, exclude_ids = []) {
    const result = await this.pool.query(
      `SELECT id, text, category
       FROM terms
       WHERE id != ALL($1::uuid[])
       ORDER BY RANDOM()
       LIMIT $2`,
      [exclude_ids, count]
    );
    return result.rows;
  }

  /**
   * Inserta un nuevo término. Lanza error 23505 si text ya existe (unique constraint).
   * @param {string} text
   * @param {string} category
   * @returns {Promise<{ id, text, category, created_at }>}
   */
  async create(text, category) {
    const result = await this.pool.query(
      `INSERT INTO terms (text, category)
       VALUES ($1, $2)
       RETURNING id, text, category, created_at`,
      [text, category]
    );
    return result.rows[0];
  }

  /**
   * Elimina un término por ID. Retorna el row eliminado o null si no existía.
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async deleteById(id) {
    const result = await this.pool.query(
      `DELETE FROM terms WHERE id = $1 RETURNING id, text, category`,
      [id]
    );
    return result.rows[0] || null;
  }
}

module.exports = TermRepository;
