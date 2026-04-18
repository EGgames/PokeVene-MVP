// Service: Lógica de negocio para scores — orquesta ScoreRepository y UserRepository (SPEC-003, SPEC-004)

const MAX_LEADERBOARD_LIMIT = 100;
const MIN_SCORE_TO_SAVE = 51;
const { calculateXpGained, calculateLevel } = require('./levelService');

class ScoreService {
  constructor(score_repository, user_repository) {
    this.score_repository = score_repository;
    this.user_repository = user_repository;
  }

  _buildError(message, status_code) {
    const err = new Error(message);
    err.statusCode = status_code;
    return err;
  }

  /**
   * Guarda un score después de validar consistencia anti-cheating.
   * @param {string} user_id
   * @param {number} score_percentage
   * @param {number} terms_answered
   * @param {number} correct_count
   * @returns {Promise<object>}
   */
  async saveScore(user_id, score_percentage, terms_answered, correct_count) {
    if (typeof score_percentage !== 'number' || score_percentage < MIN_SCORE_TO_SAVE) {
      throw this._buildError(
        `No puedes guardar un puntaje con menos de ${MIN_SCORE_TO_SAVE}%`,
        400
      );
    }

    if (!Number.isInteger(terms_answered) || terms_answered < 1) {
      throw this._buildError('terms_answered debe ser un entero positivo', 400);
    }

    if (!Number.isInteger(correct_count) || correct_count < 0) {
      throw this._buildError('correct_count debe ser un entero no negativo', 400);
    }

    if (correct_count > terms_answered) {
      throw this._buildError(
        'correct_count no puede ser mayor que terms_answered',
        400
      );
    }

    const expected_percentage = (correct_count / terms_answered) * 100;
    const tolerance = 1;
    if (Math.abs(expected_percentage - score_percentage) > tolerance) {
      throw this._buildError(
        'El score_percentage es inconsistente con correct_count y terms_answered',
        400
      );
    }

    const saved_score = await this.score_repository.create(
      user_id,
      score_percentage,
      terms_answered,
      correct_count
    );

    // Calcular y persistir XP ganado solo si hay repositorio de usuario
    if (this.user_repository) {
      const current_user = await this.user_repository.findById(user_id);
      if (current_user) {
        const xp_gained = calculateXpGained(score_percentage);
        const total_xp = current_user.xp + xp_gained;
        const new_level = calculateLevel(total_xp);
        const leveled_up = new_level > current_user.level;

        await this.user_repository.updateXpAndLevel(user_id, total_xp, new_level);

        return {
          ...saved_score,
          xp_gained,
          total_xp,
          level: new_level,
          leveled_up,
        };
      }
    }

    return saved_score;
  }

  /**
   * Obtiene el leaderboard validando parámetros de paginación.
   * @param {number} limit
   * @param {number} offset
   * @returns {Promise<Array<object>>}
   */
  async getLeaderboard(limit = 50, offset = 0) {
    if (!Number.isInteger(limit) || limit < 1) {
      throw this._buildError('limit debe ser un entero mayor a 0', 400);
    }
    if (limit > MAX_LEADERBOARD_LIMIT) {
      throw this._buildError(`limit no puede superar ${MAX_LEADERBOARD_LIMIT}`, 400);
    }
    if (!Number.isInteger(offset) || offset < 0) {
      throw this._buildError('offset debe ser un entero no negativo', 400);
    }
    return this.score_repository.getLeaderboard(limit, offset);
  }
}

module.exports = ScoreService;
