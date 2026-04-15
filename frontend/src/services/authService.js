import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

/**
 * Extrae el mensaje de error de una respuesta Axios.
 * @param {unknown} error
 * @returns {string}
 */
function extractErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    const status = error.response?.status;
    if (status === 400) return 'Datos inválidos. Revisa los campos e intenta de nuevo.';
    if (status === 401) return 'Usuario o contraseña incorrectos.';
    if (status === 409) return 'El nombre de usuario ya existe.';
    if (status === 500) return 'Error interno del servidor. Intenta más tarde.';
  }
  return 'Ocurrió un error inesperado. Intenta de nuevo.';
}

/**
 * Registra un nuevo usuario.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ id: string, username: string, token: string, created_at: string }>}
 */
export async function registerUser(username, password) {
  try {
    const res = await axios.post(`${API_BASE}/api/v1/auth/register`, {
      username,
      password,
    });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

/**
 * Autentica con credenciales y retorna el token JWT.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ id: string, username: string, token: string, expiresIn: number }>}
 */
export async function loginUser(username, password) {
  try {
    const res = await axios.post(`${API_BASE}/api/v1/auth/login`, {
      username,
      password,
    });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

/**
 * Valida el token JWT contra el endpoint /me y retorna los datos del usuario.
 * @param {string} token
 * @returns {Promise<{ id: string, username: string, created_at: string }>}
 */
export async function validateToken(token) {
  try {
    const res = await axios.get(`${API_BASE}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

/**
 * Elimina el token y la info del usuario del localStorage.
 */
export function logoutUser() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}
