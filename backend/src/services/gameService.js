// Service: Lógica de negocio para términos del juego — orquesta TermRepository (SPEC-003)

const MAX_TERMS_PER_REQUEST = 20;

class GameService {
  constructor(term_repository) {
    this.term_repository = term_repository;
  }

  _buildError(message, status_code) {
    const err = new Error(message);
    err.statusCode = status_code;
    return err;
  }

  /**
   * Obtiene N términos aleatorios validando el rango permitido.
   * @param {number} count - Cantidad de términos solicitados (1-20)
   * @param {string[]} exclude_ids - UUIDs a excluir
   * @returns {Promise<Array<{ id, text, category }>>}
   */
  async getRandomTerms(count = 10, exclude_ids = []) {
    if (!Number.isInteger(count) || count < 1) {
      throw this._buildError('El parámetro count debe ser un entero mayor a 0', 400);
    }
    if (count > MAX_TERMS_PER_REQUEST) {
      throw this._buildError(
        `El parámetro count no puede superar ${MAX_TERMS_PER_REQUEST}`,
        400
      );
    }
    return this.term_repository.getRandomTerms(count, exclude_ids);
  }
}

module.exports = GameService;
