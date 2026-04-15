import axios from 'axios';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getLeaderboard, getRandomTerms, saveScore } from '../../services/gameService';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('gameService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls random terms endpoint with count param when getRandomTerms is executed', async () => {
    // Arrange
    const terms = [{ id: '1', text: 'Pikachu', category: 'pokemon' }];
    axios.get.mockResolvedValue({ data: terms });

    // Act
    await getRandomTerms(10);

    // Assert
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/terms/random'),
      { params: { count: 10 } }
    );
  });

  it('returns array of terms when getRandomTerms succeeds', async () => {
    // Arrange
    const terms = [
      { id: '1', text: 'Pikachu', category: 'pokemon' },
      { id: '2', text: 'Arepita', category: 'venezolano' },
    ];
    axios.get.mockResolvedValue({ data: terms });

    // Act
    const result = await getRandomTerms(2);

    // Assert
    expect(result).toEqual(terms);
  });

  it('calls save score endpoint with auth header when saveScore is executed', async () => {
    // Arrange
    const response = { id: 'score-1', score_percentage: 80 };
    axios.post.mockResolvedValue({ data: response });

    // Act
    await saveScore(80, 10, 8, 'jwt-token');

    // Assert
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/scores'),
      {
        score_percentage: 80,
        terms_answered: 10,
        correct_count: 8,
      },
      {
        headers: { Authorization: 'Bearer jwt-token' },
      }
    );
  });

  it('throws error when saveScore receives bad request status 400', async () => {
    // Arrange
    const error = new Error('bad request');
    error.response = { status: 400, data: { message: 'No puedes guardar un puntaje con menos de 51%' } };
    axios.post.mockRejectedValue(error);

    // Act + Assert
    await expect(saveScore(50, 10, 5, 'jwt-token')).rejects.toMatchObject({
      response: { status: 400 },
    });
  });

  it('calls leaderboard endpoint with pagination params when getLeaderboard is executed', async () => {
    // Arrange
    const scores = [{ rank: 1, username: 'ash', score_percentage: 90 }];
    axios.get.mockResolvedValue({ data: scores });

    // Act
    await getLeaderboard(20, 10);

    // Assert
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/scores/leaderboard'),
      { params: { limit: 20, offset: 10 } }
    );
  });
});
