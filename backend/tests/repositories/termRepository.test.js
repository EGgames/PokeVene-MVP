const TermRepository = require('../../src/repositories/termRepository');

describe('TermRepository', () => {
  let pool;
  let repository;

  beforeEach(() => {
    pool = {
      query: jest.fn(),
    };
    repository = new TermRepository(pool);
  });

  it('test_getRandomTerm_returns_one_term', async () => {
    // GIVEN
    const row = { id: 't1', text: 'Pikachu', category: 'pokemon' };
    pool.query.mockResolvedValue({ rows: [row] });

    // WHEN
    const result = await repository.getRandomTerm(['x1']);

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('LIMIT 1');
    expect(pool.query.mock.calls[0][1]).toEqual([['x1']]);
    expect(result).toEqual(row);
  });

  it('test_getRandomTerm_returns_null_when_empty', async () => {
    // GIVEN
    pool.query.mockResolvedValue({ rows: [] });

    // WHEN
    const result = await repository.getRandomTerm([]);

    // THEN
    expect(result).toBeNull();
  });

  it('test_getRandomTerms_returns_n_terms', async () => {
    // GIVEN
    const rows = [
      { id: 't1', text: 'Pikachu', category: 'pokemon' },
      { id: 't2', text: 'Arepa', category: 'venezolano' },
    ];
    pool.query.mockResolvedValue({ rows });

    // WHEN
    const result = await repository.getRandomTerms(2, ['x1']);

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('LIMIT $2');
    expect(pool.query.mock.calls[0][1]).toEqual([['x1'], 2]);
    expect(result).toEqual(rows);
  });
});
