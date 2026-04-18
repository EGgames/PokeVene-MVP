import axios from 'axios';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  submitSuggestion,
  getMySuggestions,
} from '../../services/suggestionService';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

describe('suggestionService', () => {
  const token = 'jwt-user-token';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call submitSuggestion with correct url, body and headers', async () => {
    const payload = { text: 'Typhlosion', category: 'pokemon' };
    axios.post.mockResolvedValue({ data: { id: 's1', status: 'pending' } });

    await submitSuggestion(payload, token);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/suggestions'),
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  });

  it('should call getMySuggestions with correct url and headers', async () => {
    axios.get.mockResolvedValue({ data: { suggestions: [] } });

    await getMySuggestions(token);

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/suggestions/me'),
      { headers: { Authorization: `Bearer ${token}` } }
    );
  });
});
