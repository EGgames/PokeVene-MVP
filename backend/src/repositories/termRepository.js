// Repository: Acceso a DB para la entidad Term — sin lógica de negocio (SPEC-003)

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
}

module.exports = TermRepository;
