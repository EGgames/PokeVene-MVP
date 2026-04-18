import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

function extractErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
  }
  return 'Ocurrió un error inesperado. Intenta de nuevo.';
}

/** POST /api/v1/suggestions */
export async function submitSuggestion(data, token) {
  try {
    const res = await axios.post(`${API_BASE}/api/v1/suggestions`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

/** GET /api/v1/suggestions/me */
export async function getMySuggestions(token) {
  try {
    const res = await axios.get(`${API_BASE}/api/v1/suggestions/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

/** GET /api/v1/suggestions/threshold */
export async function getSuggestionThreshold(token) {
  try {
    const res = await axios.get(`${API_BASE}/api/v1/suggestions/threshold`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
