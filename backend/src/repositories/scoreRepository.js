// Repository: Acceso a DB para la entidad Score — sin lógica de negocio (SPEC-003)

class ScoreRepository {
  constructor(pool) {
    this.pool = pool;
  }

  /**
   * Inserta un nuevo score y retorna el row creado.
   * @param {string} user_id
   * @param {number} score_percentage
   * @param {number} terms_answered
   * @param {number} correct_count
   * @returns {Promise<object>}
   */
  async create(user_id, score_percentage, terms_answered, correct_count) {
    const result = await this.pool.query(
      `INSERT INTO scores (user_id, score_percentage, terms_answered, correct_count)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, score_percentage, terms_answered, correct_count, created_at`,
      [user_id, score_percentage, terms_answered, correct_count]
    );
    return result.rows[0];
  }

  /**
   * Obtiene el leaderboard con ranking calculado por ROW_NUMBER.
   * @param {number} limit
   * @param {number} offset
   * @returns {Promise<Array<{ rank, user_id, username, score_percentage, created_at }>>}
   */
  async getLeaderboard(limit = 50, offset = 0) {
    const result = await this.pool.query(
      `SELECT
         ROW_NUMBER() OVER (ORDER BY s.score_percentage DESC, s.created_at DESC) AS rank,
         s.user_id,
         u.username,
         s.score_percentage,
         s.created_at
       FROM scores s
       JOIN users u ON s.user_id = u.id
       WHERE u.deleted_at IS NULL
       ORDER BY s.score_percentage DESC, s.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  /**
   * Obtiene los scores de un usuario específico.
   * @param {string} user_id
   * @param {number} limit
   * @param {number} offset
   * @returns {Promise<Array<object>>}
   */
  async findByUserId(user_id, limit = 10, offset = 0) {
    const result = await this.pool.query(
      `SELECT id, user_id, score_percentage, terms_answered, correct_count, created_at
       FROM scores
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [user_id, limit, offset]
    );
    return result.rows;
  }
}

module.exports = ScoreRepository;
