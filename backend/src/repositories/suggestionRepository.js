// Repository: Acceso a DB para la entidad TermSuggestion — sin lógica de negocio (SPEC-004)

class SuggestionRepository {
  constructor(pool) {
    this.pool = pool;
  }

  /**
   * Inserta una nueva sugerencia de término.
   * @param {string} userId
   * @param {string} text
   * @param {string} category
   * @returns {Promise<object>}
   */
  async create(userId, text, category) {
    const result = await this.pool.query(
      `INSERT INTO term_suggestions (user_id, text, category)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, text, category, status, created_at, updated_at`,
      [userId, text, category]
    );
    return result.rows[0];
  }

  /**
   * Busca una sugerencia por ID con JOIN al usuario que la creó.
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    const result = await this.pool.query(
      `SELECT ts.id, ts.user_id, ts.text, ts.category, ts.status,
              ts.reviewed_by, ts.review_note, ts.created_at, ts.updated_at,
              u.username
       FROM term_suggestions ts
       JOIN users u ON ts.user_id = u.id
       WHERE ts.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Lista todas las sugerencias de un usuario.
   * @param {string} userId
   * @returns {Promise<Array<object>>}
   */
  async findByUserId(userId) {
    const result = await this.pool.query(
      `SELECT id, user_id, text, category, status, review_note, created_at, updated_at
       FROM term_suggestions
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  /**
   * Lista sugerencias filtradas por status con paginación y JOIN de username.
   * @param {string} status
   * @param {number} limit
   * @param {number} offset
   * @returns {Promise<Array<object>>}
   */
  async findByStatus(status, limit, offset) {
    const result = await this.pool.query(
      `SELECT ts.id, ts.user_id, ts.text, ts.category, ts.status,
              ts.reviewed_by, ts.review_note, ts.created_at, ts.updated_at,
              u.username
       FROM term_suggestions ts
       JOIN users u ON ts.user_id = u.id
       WHERE ts.status = $1
       ORDER BY ts.created_at DESC
       LIMIT $2 OFFSET $3`,
      [status, limit, offset]
    );
    return result.rows;
  }

  /**
   * Cuenta sugerencias por status para paginación.
   * @param {string} status
   * @returns {Promise<number>}
   */
  async countByStatus(status) {
    const result = await this.pool.query(
      `SELECT COUNT(*)::int AS total FROM term_suggestions WHERE status = $1`,
      [status]
    );
    return result.rows[0].total;
  }

  /**
   * Cuenta sugerencias pendientes de un usuario específico.
   * @param {string} userId
   * @returns {Promise<number>}
   */
  async countPendingByUser(userId) {
    const result = await this.pool.query(
      `SELECT COUNT(*)::int AS total
       FROM term_suggestions
       WHERE user_id = $1
         AND status = 'pending'`,
      [userId]
    );
    return result.rows[0].total;
  }

  /**
   * Actualiza el status de una sugerencia con información de revisión.
   * @param {string} id
   * @param {string} status
   * @param {string|null} reviewedBy
   * @param {string|null} reviewNote
   * @returns {Promise<object|null>}
   */
  async updateStatus(id, status, reviewedBy, reviewNote) {
    const result = await this.pool.query(
      `UPDATE term_suggestions
       SET status = $1, reviewed_by = $2, review_note = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING id, user_id, text, category, status, reviewed_by, review_note, created_at, updated_at`,
      [status, reviewedBy, reviewNote, id]
    );
    return result.rows[0] || null;
  }

  /**
   * Verifica si un término ya existe en terms o en sugerencias pendientes (case-insensitive).
   * @param {string} text
   * @returns {Promise<boolean>}
   */
  async existsByText(text) {
    const result = await this.pool.query(
      `SELECT EXISTS (
         SELECT 1 FROM terms WHERE LOWER(text) = LOWER($1)
         UNION ALL
         SELECT 1 FROM term_suggestions WHERE LOWER(text) = LOWER($1) AND status = 'pending'
       ) AS exists`,
      [text]
    );
    return result.rows[0].exists;
  }
}

module.exports = SuggestionRepository;
