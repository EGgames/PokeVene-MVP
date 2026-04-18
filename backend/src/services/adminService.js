// Service: Lógica de negocio de administración — orquesta AdminRepository, TermRepository,
//          SuggestionRepository y SettingsRepository (SPEC-004)

const VALID_ROLES = ['user', 'admin'];
const VALID_CATEGORIES = ['pokemon', 'venezolano'];
const VALID_SUGGESTION_STATUSES = ['pending', 'approved', 'rejected'];

class AdminService {
  constructor(adminRepository, termRepository, suggestionRepository, settingsRepository, pool) {
    this.adminRepository = adminRepository;
    this.termRepository = termRepository;
    this.suggestionRepository = suggestionRepository;
    this.settingsRepository = settingsRepository;
    this.pool = pool;
  }

  _buildError(message, statusCode) {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
  }

  /**
   * Lista usuarios con paginación y búsqueda opcional.
   * @param {number} limit
   * @param {number} offset
   * @param {string} search
   * @returns {Promise<{ users, total }>}
   */
  async listUsers(limit = 20, offset = 0, search = '') {
    if (!Number.isInteger(limit) || limit < 1) {
      throw this._buildError('limit debe ser un entero mayor a 0', 400);
    }
    if (!Number.isInteger(offset) || offset < 0) {
      throw this._buildError('offset debe ser un entero no negativo', 400);
    }
    const [users, total] = await Promise.all([
      this.adminRepository.listUsers(limit, offset, search),
      this.adminRepository.countUsers(search),
    ]);
    return { users, total };
  }

  /**
   * Actualiza el rol de un usuario. Un admin no puede cambiar su propio rol.
   * @param {string} adminId - ID del admin ejecutante
   * @param {string} targetUserId
   * @param {string} role
   * @returns {Promise<object>}
   */
  async updateUserRole(adminId, targetUserId, role) {
    if (!VALID_ROLES.includes(role)) {
      throw this._buildError('El rol debe ser "user" o "admin"', 400);
    }
    if (adminId === targetUserId) {
      throw this._buildError('No puedes cambiar tu propio rol', 403);
    }
    const updated = await this.adminRepository.updateUserRole(targetUserId, role);
    if (!updated) {
      throw this._buildError('Usuario no encontrado', 404);
    }
    return updated;
  }

  /**
   * Banea a un usuario. Un admin no puede banearse a sí mismo.
   * @param {string} adminId
   * @param {string} targetUserId
   * @returns {Promise<{ message: string }>}
   */
  async banUser(adminId, targetUserId) {
    if (adminId === targetUserId) {
      throw this._buildError('No puedes banearte a ti mismo', 403);
    }
    const user = await this.adminRepository.findUserById(targetUserId);
    if (!user) {
      throw this._buildError('Usuario no encontrado', 404);
    }
    await this.adminRepository.banUser(targetUserId);
    return { message: 'Usuario baneado exitosamente' };
  }

  /**
   * Desbanea a un usuario.
   * @param {string} targetUserId
   * @returns {Promise<{ message: string }>}
   */
  async unbanUser(targetUserId) {
    const user = await this.adminRepository.findUserById(targetUserId);
    if (!user) {
      throw this._buildError('Usuario no encontrado', 404);
    }
    await this.adminRepository.unbanUser(targetUserId);
    return { message: 'Usuario desbaneado exitosamente' };
  }

  /**
   * Crea un término directamente (sin pasar por sugerencias).
   * @param {string} text
   * @param {string} category
   * @returns {Promise<object>}
   */
  async addTerm(text, category) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw this._buildError('El texto del término es requerido', 400);
    }
    if (!VALID_CATEGORIES.includes(category)) {
      throw this._buildError('La categoría debe ser "pokemon" o "venezolano"', 400);
    }
    try {
      return await this.termRepository.create(text.trim(), category);
    } catch (err) {
      if (err.code === '23505') {
        throw this._buildError('El término ya existe', 409);
      }
      throw err;
    }
  }

  /**
   * Elimina un término por ID.
   * @param {string} termId
   */
  async deleteTerm(termId) {
    const deleted = await this.termRepository.deleteById(termId);
    if (!deleted) {
      throw this._buildError('Término no encontrado', 404);
    }
  }

  /**
   * Lista sugerencias filtradas por status con paginación.
   * @param {string} status
   * @param {number} limit
   * @param {number} offset
   * @returns {Promise<{ suggestions, total }>}
   */
  async listSuggestions(status = 'pending', limit = 20, offset = 0) {
    if (!VALID_SUGGESTION_STATUSES.includes(status)) {
      throw this._buildError('status debe ser "pending", "approved" o "rejected"', 400);
    }
    const [suggestions, total] = await Promise.all([
      this.suggestionRepository.findByStatus(status, limit, offset),
      this.suggestionRepository.countByStatus(status),
    ]);
    return { suggestions, total };
  }

  /**
   * Revisa una sugerencia. Si se aprueba, crea el término en una transacción atómica.
   * @param {string} suggestionId
   * @param {string} status
   * @param {string} reviewedBy
   * @param {string|null} reviewNote
   * @returns {Promise<object>}
   */
  async reviewSuggestion(suggestionId, status, reviewedBy, reviewNote) {
    if (!['approved', 'rejected'].includes(status)) {
      throw this._buildError('El status de revisión debe ser "approved" o "rejected"', 400);
    }

    const suggestion = await this.suggestionRepository.findById(suggestionId);
    if (!suggestion) {
      throw this._buildError('Sugerencia no encontrada', 404);
    }
    if (suggestion.status !== 'pending') {
      throw this._buildError('La sugerencia ya fue revisada', 409);
    }

    if (status === 'approved') {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(
          `UPDATE term_suggestions
           SET status = $1, reviewed_by = $2, review_note = $3, updated_at = NOW()
           WHERE id = $4`,
          [status, reviewedBy, reviewNote || null, suggestionId]
        );
        await client.query(
          `INSERT INTO terms (text, category) VALUES ($1, $2)`,
          [suggestion.text, suggestion.category]
        );
        await client.query('COMMIT');
        return { message: 'Sugerencia aprobada y término creado exitosamente' };
      } catch (err) {
        await client.query('ROLLBACK');
        if (err.code === '23505') {
          throw this._buildError('El término ya existe en la base de datos', 409);
        }
        throw err;
      } finally {
        client.release();
      }
    }

    return this.suggestionRepository.updateStatus(
      suggestionId,
      status,
      reviewedBy,
      reviewNote || null
    );
  }

  /**
   * Retorna todos los settings de configuración.
   * @returns {Promise<object>}
   */
  async getSettings() {
    return this.settingsRepository.getAll();
  }

  /**
   * Actualiza settings de configuración. Valida suggestion_level_threshold 1-100.
   * @param {object} data
   * @param {string} updatedBy
   * @returns {Promise<object>}
   */
  async updateSettings(data, updatedBy) {
    if (!data || typeof data !== 'object') {
      throw this._buildError('El cuerpo de la petición debe ser un objeto', 400);
    }

    const results = {};
    for (const [key, value] of Object.entries(data)) {
      if (key === 'suggestion_level_threshold') {
        const num = parseInt(value, 10);
        if (isNaN(num) || num < 1 || num > 100) {
          throw this._buildError('suggestion_level_threshold debe ser un número entre 1 y 100', 400);
        }
        results[key] = await this.settingsRepository.set(key, String(num), updatedBy);
      } else {
        results[key] = await this.settingsRepository.set(key, String(value), updatedBy);
      }
    }
    return results;
  }
}

module.exports = AdminService;
