const ScoreRepository = require('../../src/repositories/scoreRepository');

describe('ScoreRepository', () => {
  let pool;
  let repository;

  beforeEach(() => {
    pool = {
      query: jest.fn(),
    };
    repository = new ScoreRepository(pool);
  });

  it('test_create_inserts_and_returns_created_score', async () => {
    // GIVEN
    const row = { id: 's1', user_id: 'u1', score_percentage: 60 };
    pool.query.mockResolvedValue({ rows: [row] });

    // WHEN
    const result = await repository.create('u1', 60, 10, 6);

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('INSERT INTO scores');
    expect(pool.query.mock.calls[0][1]).toEqual(['u1', 60, 10, 6]);
    expect(result).toEqual(row);
  });

  it('test_getLeaderboard_returns_ordered_rows', async () => {
    // GIVEN
    const rows = [{ rank: 1, user_id: 'u1', username: 'poke', score_percentage: 80 }];
    pool.query.mockResolvedValue({ rows });

    // WHEN
    const result = await repository.getLeaderboard(50, 0);

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('ROW_NUMBER() OVER');
    expect(pool.query.mock.calls[0][1]).toEqual([50, 0]);
    expect(result).toEqual(rows);
  });

  it('test_findByUserId_returns_rows_for_user', async () => {
    // GIVEN
    const rows = [{ id: 's1', user_id: 'u1', score_percentage: 60 }];
    pool.query.mockResolvedValue({ rows });

    // WHEN
    const result = await repository.findByUserId('u1', 10, 0);

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('WHERE user_id = $1');
    expect(pool.query.mock.calls[0][1]).toEqual(['u1', 10, 0]);
    expect(result).toEqual(rows);
  });
});
