const ScoreService = require('../../src/services/scoreService');

describe('ScoreService', () => {
  let scoreRepository;
  let service;

  beforeEach(() => {
    scoreRepository = {
      create: jest.fn(),
      getLeaderboard: jest.fn(),
    };
    service = new ScoreService(scoreRepository);
  });

  it('test_saveScore_success_with_valid_winning_score', async () => {
    // GIVEN
    const saved = { id: 'score-1', user_id: 'u1', score_percentage: 60 };
    scoreRepository.create.mockResolvedValue(saved);

    // WHEN
    const result = await service.saveScore('u1', 60, 10, 6);

    // THEN
    expect(scoreRepository.create).toHaveBeenCalledWith('u1', 60, 10, 6);
    expect(result).toEqual(saved);
  });

  it('test_saveScore_rejects_score_less_than_51', async () => {
    // GIVEN
    const score = 50;

    // WHEN
    const promise = service.saveScore('u1', score, 10, 5);

    // THEN
    await expect(promise).rejects.toMatchObject({
      statusCode: 400,
      message: 'No puedes guardar un puntaje con menos de 51%',
    });
  });

  it('test_saveScore_rejects_correctCount_greater_than_termsAnswered', async () => {
    // GIVEN
    const terms_answered = 10;
    const correct_count = 11;

    // WHEN
    const promise = service.saveScore('u1', 90, terms_answered, correct_count);

    // THEN
    await expect(promise).rejects.toMatchObject({
      statusCode: 400,
      message: 'correct_count no puede ser mayor que terms_answered',
    });
  });

  it('test_saveScore_rejects_inconsistent_percentage', async () => {
    // GIVEN
    const score_percentage = 90;
    const terms_answered = 10;
    const correct_count = 6;

    // WHEN
    const promise = service.saveScore('u1', score_percentage, terms_answered, correct_count);

    // THEN
    await expect(promise).rejects.toMatchObject({
      statusCode: 400,
      message: 'El score_percentage es inconsistente con correct_count y terms_answered',
    });
  });

  it('test_getLeaderboard_returns_array_with_limit_offset', async () => {
    // GIVEN
    const leaderboard = [{ rank: 1, username: 'poke' }];
    scoreRepository.getLeaderboard.mockResolvedValue(leaderboard);

    // WHEN
    const result = await service.getLeaderboard(20, 10);

    // THEN
    expect(scoreRepository.getLeaderboard).toHaveBeenCalledWith(20, 10);
    expect(result).toEqual(leaderboard);
  });
});
