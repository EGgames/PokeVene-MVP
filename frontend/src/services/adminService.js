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

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

/** GET /api/v1/admin/users */
export async function getUsers(token, { limit = 20, offset = 0, search = '' } = {}) {
  try {
    const res = await axios.get(`${API_BASE}/api/v1/admin/users`, {
      headers: authHeader(token),
      params: { limit, offset, search: search || undefined },
    });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

/** PATCH /api/v1/admin/users/:id/role */
export async function updateUserRole(id, role, token) {
  try {
    const res = await axios.patch(
      `${API_BASE}/api/v1/admin/users/${id}/role`,
      { role },
      { headers: authHeader(token) }
    );
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

/** PATCH /api/v1/admin/users/:id/ban */
export async function banUser(id, token) {
  try {
    const res = await axios.patch(
      `${API_BASE}/api/v1/admin/users/${id}/ban`,
      {},
      { headers: authHeader(token) }
    );
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

/** PATCH /api/v1/admin/users/:id/unban */
export async function unbanUser(id, token) {
  try {
    const res = await axios.patch(
      `${API_BASE}/api/v1/admin/users/${id}/unban`,
      {},
      { headers: authHeader(token) }
    );
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

/** POST /api/v1/admin/terms */
export async function addTerm(data, token) {
  try {
    const res = await axios.post(`${API_BASE}/api/v1/admin/terms`, data, {
      headers: authHeader(token),
    });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

/** DELETE /api/v1/admin/terms/:id */
export async function deleteTerm(id, token) {
  try {
    const res = await axios.delete(`${API_BASE}/api/v1/admin/terms/${id}`, {
      headers: authHeader(token),
    });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

/** GET /api/v1/admin/suggestions */
export async function getSuggestions(token, { status = '', limit = 20, offset = 0 } = {}) {
  try {
    const res = await axios.get(`${API_BASE}/api/v1/admin/suggestions`, {
      headers: authHeader(token),
      params: { limit, offset, status: status || undefined },
    });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

/** PATCH /api/v1/admin/suggestions/:id */
export async function reviewSuggestion(id, data, token) {
  try {
    const res = await axios.patch(
      `${API_BASE}/api/v1/admin/suggestions/${id}`,
      data,
      { headers: authHeader(token) }
    );
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

/** GET /api/v1/admin/settings */
export async function getSettings(token) {
  try {
    const res = await axios.get(`${API_BASE}/api/v1/admin/settings`, {
      headers: authHeader(token),
    });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

/** PUT /api/v1/admin/settings */
export async function updateSettings(data, token) {
  try {
    const res = await axios.put(`${API_BASE}/api/v1/admin/settings`, data, {
      headers: authHeader(token),
    });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
