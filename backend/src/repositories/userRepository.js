// Repository: Acceso a DB para la entidad User — sin lógica de negocio (SPEC-002)

class UserRepository {
  constructor(pool) {
    this.pool = pool;
  }

  /**
   * Inserta un nuevo usuario y retorna el row creado.
   * @param {string} username
   * @param {string} password_hash
   * @returns {Promise<object>}
   */
  async create(username, password_hash) {
    const result = await this.pool.query(
      `INSERT INTO users (username, password_hash)
       VALUES ($1, $2)
       RETURNING id, username, created_at, updated_at`,
      [username, password_hash]
    );
    return result.rows[0];
  }

  /**
   * Busca un usuario por username (case-insensitive) excluyendo soft-deleted.
   * @param {string} username
   * @returns {Promise<object|null>}
   */
  async findByUsername(username) {
    const result = await this.pool.query(
      `SELECT id, username, password_hash, created_at, updated_at
       FROM users
       WHERE LOWER(username) = LOWER($1)
         AND deleted_at IS NULL`,
      [username]
    );
    return result.rows[0] || null;
  }

  /**
   * Busca un usuario por UUID excluyendo soft-deleted.
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    const result = await this.pool.query(
      `SELECT id, username, created_at, updated_at
       FROM users
       WHERE id = $1
         AND deleted_at IS NULL`,
      [id]
    );
    return result.rows[0] || null;
  }
}

module.exports = UserRepository;
