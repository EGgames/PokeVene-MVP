const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000';

/**
 * Crea un usuario de prueba vía API.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ id: string, username: string, token: string }>}
 */
async function createTestUser(username, password) {
  const res = await axios.post(`${API_URL}/api/v1/auth/register`, {
    username,
    password,
  });
  return res.data;
}

/**
 * Inicia sesión de un usuario de prueba y retorna el token.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ id: string, username: string, token: string }>}
 */
async function loginTestUser(username, password) {
  const res = await axios.post(`${API_URL}/api/v1/auth/login`, {
    username,
    password,
  });
  return res.data;
}

/**
 * Verifica que el backend esté levantado.
 * @returns {Promise<boolean>}
 */
async function healthCheck() {
  try {
    const res = await axios.get(`${API_URL}/health`, { timeout: 5000 });
    return res.data.status === 'ok';
  } catch {
    return false;
  }
}

/**
 * Limpieza de usuario de prueba.
 * Nota: El backend no expone un endpoint DELETE para usuarios.
 * Esta función intenta un registro para verificar la no-existencia
 * y se usa como placeholder para limpieza manual o futura implementación.
 * @param {string} _username
 */
async function cleanupTestUser(_username) {
  // No-op: El backend no tiene endpoint de eliminación de usuarios.
  // Para entornos de test, limpiar la BD directamente o usar un seed.
}

/**
 * Guarda un puntaje vía API (para setup de datos de test).
 * @param {string} token
 * @param {number} scorePercentage
 * @param {number} termsAnswered
 * @param {number} correctCount
 * @returns {Promise<Object>}
 */
async function saveTestScore(token, scorePercentage, termsAnswered, correctCount) {
  const res = await axios.post(
    `${API_URL}/api/v1/scores`,
    { score_percentage: scorePercentage, terms_answered: termsAnswered, correct_count: correctCount },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

/**
 * Obtiene el leaderboard vía API.
 * @param {number} limit
 * @returns {Promise<Array>}
 */
async function getLeaderboard(limit = 50) {
  const res = await axios.get(`${API_URL}/api/v1/scores/leaderboard`, {
    params: { limit },
  });
  return res.data;
}

module.exports = {
  createTestUser,
  loginTestUser,
  healthCheck,
  cleanupTestUser,
  saveTestScore,
  getLeaderboard,
};
