import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

/**
 * Obtiene un lote de términos aleatorios desde el backend.
 * @param {number} count - Cantidad de términos a obtener (default 10)
 * @param {string[]} excludeIds - IDs de términos a excluir
 */
export async function getRandomTerms(count = 10, excludeIds = []) {
  const params = { count };
  if (excludeIds.length > 0) {
    params.exclude = excludeIds.join(',');
  }
  const res = await axios.get(`${API_BASE}/api/v1/terms/random`, { params });
  return res.data;
}

/**
 * Guarda el puntaje de una partida (requiere autenticación).
 * @param {number} scorePercentage
 * @param {number} termsAnswered
 * @param {number} correctCount
 * @param {string} token - JWT del usuario autenticado
 */
export async function saveScore(scorePercentage, termsAnswered, correctCount, token) {
  const res = await axios.post(
    `${API_BASE}/api/v1/scores`,
    {
      score_percentage: scorePercentage,
      terms_answered: termsAnswered,
      correct_count: correctCount,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

/**
 * Obtiene el leaderboard público.
 * @param {number} limit
 * @param {number} offset
 */
export async function getLeaderboard(limit = 50, offset = 0) {
  const res = await axios.get(`${API_BASE}/api/v1/scores/leaderboard`, {
    params: { limit, offset },
  });
  return res.data;
}
