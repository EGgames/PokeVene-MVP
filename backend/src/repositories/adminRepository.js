// Repository: Acceso a DB para operaciones de administración — sin lógica de negocio (SPEC-004)

class AdminRepository {
  constructor(pool) {
    this.pool = pool;
  }

  /**
   * Lista usuarios con paginación y búsqueda opcional por username.
   * @param {number} limit
   * @param {number} offset
   * @param {string} search - Búsqueda ILIKE (puede ser vacío)
   * @returns {Promise<Array<object>>}
   */
  async listUsers(limit, offset, search) {
    const params = [limit, offset];
    let where = 'WHERE deleted_at IS NULL';
    if (search) {
      params.push(`%${search}%`);
      where += ` AND username ILIKE $${params.length}`;
    }
    const result = await this.pool.query(
      `SELECT id, username, role, xp, level, banned_at, created_at
       FROM users
       ${where}
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      params
    );
    return result.rows;
  }

  /**
   * Cuenta usuarios con búsqueda opcional para paginación.
   * @param {string} search
   * @returns {Promise<number>}
   */
  async countUsers(search) {
    const params = [];
    let where = 'WHERE deleted_at IS NULL';
    if (search) {
      params.push(`%${search}%`);
      where += ` AND username ILIKE $${params.length}`;
    }
    const result = await this.pool.query(
      `SELECT COUNT(*)::int AS total FROM users ${where}`,
      params
    );
    return result.rows[0].total;
  }

  /**
   * Busca un usuario por ID para operaciones admin.
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async findUserById(id) {
    const result = await this.pool.query(
      `SELECT id, username, role, xp, level, banned_at, created_at
       FROM users
       WHERE id = $1
         AND deleted_at IS NULL`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Actualiza el rol de un usuario.
   * @param {string} id
   * @param {string} role
   * @returns {Promise<object|null>}
   */
  async updateUserRole(id, role) {
    const result = await this.pool.query(
      `UPDATE users
       SET role = $1, updated_at = NOW()
       WHERE id = $2
         AND deleted_at IS NULL
       RETURNING id, username, role, xp, level, banned_at, created_at`,
      [role, id]
    );
    return result.rows[0] || null;
  }

  /**
   * Aplica ban al usuario (banned_at = NOW()).
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async banUser(id) {
    const result = await this.pool.query(
      `UPDATE users
       SET banned_at = NOW(), updated_at = NOW()
       WHERE id = $1
         AND deleted_at IS NULL
       RETURNING id, username, banned_at`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Elimina el ban del usuario (banned_at = NULL).
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async unbanUser(id) {
    const result = await this.pool.query(
      `UPDATE users
       SET banned_at = NULL, updated_at = NOW()
       WHERE id = $1
         AND deleted_at IS NULL
       RETURNING id, username, banned_at`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Actualiza xp y level de un usuario.
   * @param {string} id
   * @param {number} xp
   * @param {number} level
   * @returns {Promise<object|null>}
   */
  async updateUserXpAndLevel(id, xp, level) {
    const result = await this.pool.query(
      `UPDATE users
       SET xp = $1, level = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, xp, level`,
      [xp, level, id]
    );
    return result.rows[0] || null;
  }
}

module.exports = AdminRepository;
