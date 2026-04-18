// Service: Lógica de negocio para sugerencias de términos por usuarios (SPEC-004)

const VALID_CATEGORIES = ['pokemon', 'venezolano'];
const MAX_PENDING_SUGGESTIONS = 5;
const DEFAULT_SUGGESTION_THRESHOLD = 10;

class SuggestionService {
  constructor(suggestionRepository, settingsRepository) {
    this.suggestionRepository = suggestionRepository;
    this.settingsRepository = settingsRepository;
  }

  _buildError(message, statusCode) {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
  }

  /**
   * Crea una sugerencia de término si el usuario cumple los requisitos.
   * Valida: nivel >= umbral, < 5 pendientes, texto no duplicado.
   * @param {string} userId
   * @param {number} userLevel
   * @param {string} text
   * @param {string} category
   * @returns {Promise<object>}
   */
  async createSuggestion(userId, userLevel, text, category) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw this._buildError('El texto de la sugerencia es requerido', 400);
    }
    if (!VALID_CATEGORIES.includes(category)) {
      throw this._buildError('La categoría debe ser "pokemon" o "venezolano"', 400);
    }

    const threshold_str = await this.settingsRepository.get('suggestion_level_threshold');
    const threshold = threshold_str ? parseInt(threshold_str, 10) : DEFAULT_SUGGESTION_THRESHOLD;

    if (userLevel < threshold) {
      throw this._buildError(`Necesitas nivel ${threshold} para sugerir términos`, 403);
    }

    const pending_count = await this.suggestionRepository.countPendingByUser(userId);
    if (pending_count >= MAX_PENDING_SUGGESTIONS) {
      throw this._buildError(
        'Ya tienes 5 sugerencias pendientes. Espera a que sean revisadas',
        409
      );
    }

    const exists = await this.suggestionRepository.existsByText(text.trim());
    if (exists) {
      throw this._buildError('Este término ya existe o ya fue sugerido', 409);
    }

    return this.suggestionRepository.create(userId, text.trim(), category);
  }

  /**
   * Retorna todas las sugerencias del usuario.
   * @param {string} userId
   * @returns {Promise<Array<object>>}
   */
  async getUserSuggestions(userId) {
    return this.suggestionRepository.findByUserId(userId);
  }
}

module.exports = SuggestionService;
