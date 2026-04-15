const { createTestUser, loginTestUser, cleanupTestUser } = require('./api.helper');

/**
 * Registra un usuario de prueba y retorna sus datos con token.
 * Si el usuario ya existe (409), intenta hacer login en su lugar.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ id: string, username: string, token: string }>}
 */
async function ensureTestUser(username, password) {
  try {
    return await createTestUser(username, password);
  } catch (err) {
    if (err.response && err.response.status === 409) {
      return await loginTestUser(username, password);
    }
    throw err;
  }
}

/**
 * Configura la sesión autenticada en el navegador inyectando el token
 * en localStorage para que la app React lo detecte al cargar.
 * @param {string} token
 * @param {{ id: string, username: string, created_at?: string }} userData
 */
async function setAuthInBrowser(token, userData) {
  await browser.execute(
    (t, u) => {
      localStorage.setItem('auth_token', t);
      localStorage.setItem('auth_user', JSON.stringify(u));
    },
    token,
    userData
  );
}

/**
 * Limpia la sesión de autenticación del navegador.
 */
async function clearAuthInBrowser() {
  await browser.execute(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  });
}

/**
 * Obtiene el token almacenado en localStorage.
 * @returns {Promise<string|null>}
 */
async function getStoredToken() {
  return browser.execute(() => localStorage.getItem('auth_token'));
}

/**
 * Obtiene los datos del usuario almacenados en localStorage.
 * @returns {Promise<Object|null>}
 */
async function getStoredUser() {
  return browser.execute(() => {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  });
}

module.exports = {
  ensureTestUser,
  setAuthInBrowser,
  clearAuthInBrowser,
  getStoredToken,
  getStoredUser,
  cleanupTestUser,
};
