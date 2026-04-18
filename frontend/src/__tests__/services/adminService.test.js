import axios from 'axios';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getUsers,
  updateUserRole,
  banUser,
  unbanUser,
  addTerm,
  deleteTerm,
  getSuggestions,
  reviewSuggestion,
  getSettings,
  updateSettings,
} from '../../services/adminService';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

describe('adminService', () => {
  const token = 'jwt-admin-token';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call getUsers with url, headers and params', async () => {
    axios.get.mockResolvedValue({ data: { users: [], total: 0 } });

    await getUsers(token, { limit: 10, offset: 5, search: 'ash' });

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/admin/users'),
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 10, offset: 5, search: 'ash' },
      }
    );
  });

  it('should call updateUserRole with correct url, body and headers', async () => {
    axios.patch.mockResolvedValue({ data: { id: 'u1', role: 'admin' } });

    await updateUserRole('u1', 'admin', token);

    expect(axios.patch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/admin/users/u1/role'),
      { role: 'admin' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  });

  it('should call banUser with correct endpoint and headers', async () => {
    axios.patch.mockResolvedValue({ data: { message: 'ok' } });

    await banUser('u2', token);

    expect(axios.patch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/admin/users/u2/ban'),
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  });

  it('should call unbanUser with correct endpoint and headers', async () => {
    axios.patch.mockResolvedValue({ data: { message: 'ok' } });

    await unbanUser('u2', token);

    expect(axios.patch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/admin/users/u2/unban'),
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  });

  it('should call addTerm with correct body and headers', async () => {
    axios.post.mockResolvedValue({ data: { id: 't1' } });
    const payload = { text: 'Totodile', category: 'pokemon' };

    await addTerm(payload, token);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/admin/terms'),
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  });

  it('should call deleteTerm with correct url and headers', async () => {
    axios.delete.mockResolvedValue({ data: { deleted: true } });

    await deleteTerm('term-1', token);

    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/admin/terms/term-1'),
      { headers: { Authorization: `Bearer ${token}` } }
    );
  });

  it('should call getSuggestions with status filter and pagination', async () => {
    axios.get.mockResolvedValue({ data: { suggestions: [], total: 0 } });

    await getSuggestions(token, { status: 'pending', limit: 30, offset: 10 });

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/admin/suggestions'),
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 30, offset: 10, status: 'pending' },
      }
    );
  });

  it('should call reviewSuggestion with status body and headers', async () => {
    axios.patch.mockResolvedValue({ data: { id: 's1', status: 'approved' } });

    await reviewSuggestion('s1', { status: 'approved' }, token);

    expect(axios.patch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/admin/suggestions/s1'),
      { status: 'approved' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  });

  it('should call getSettings with auth headers', async () => {
    axios.get.mockResolvedValue({ data: { suggestion_level_threshold: 10 } });

    await getSettings(token);

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/admin/settings'),
      { headers: { Authorization: `Bearer ${token}` } }
    );
  });

  it('should call updateSettings with body and headers', async () => {
    axios.put.mockResolvedValue({ data: { suggestion_level_threshold: 15 } });
    const payload = { suggestion_level_threshold: 15 };

    await updateSettings(payload, token);

    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/admin/settings'),
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  });
});