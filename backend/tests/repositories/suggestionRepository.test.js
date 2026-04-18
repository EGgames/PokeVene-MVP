const SuggestionRepository = require('../../src/repositories/suggestionRepository');

describe('SuggestionRepository', () => {
  let pool;
  let repository;

  beforeEach(() => {
    pool = { query: jest.fn() };
    repository = new SuggestionRepository(pool);
  });

  it('test_create_inserts_suggestion_and_returns_row', async () => {
    // GIVEN
    const created = { id: 's1', status: 'pending' };
    pool.query.mockResolvedValue({ rows: [created] });

    // WHEN
    const result = await repository.create('u1', 'Typhlosion', 'pokemon');

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('INSERT INTO term_suggestions');
    expect(pool.query.mock.calls[0][1]).toEqual(['u1', 'Typhlosion', 'pokemon']);
    expect(result).toEqual(created);
  });

  it('test_findById_queries_join_and_returns_row', async () => {
    // GIVEN
    const row = { id: 's1', username: 'ash' };
    pool.query.mockResolvedValue({ rows: [row] });

    // WHEN
    const result = await repository.findById('s1');

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('JOIN users u ON ts.user_id = u.id');
    expect(pool.query.mock.calls[0][1]).toEqual(['s1']);
    expect(result).toEqual(row);
  });

  it('test_findByUserId_queries_user_suggestions', async () => {
    // GIVEN
    const rows = [{ id: 's1' }];
    pool.query.mockResolvedValue({ rows });

    // WHEN
    const result = await repository.findByUserId('u1');

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('WHERE user_id = $1');
    expect(pool.query.mock.calls[0][1]).toEqual(['u1']);
    expect(result).toEqual(rows);
  });

  it('test_findByStatus_queries_status_limit_offset', async () => {
    // GIVEN
    const rows = [{ id: 's1', status: 'pending' }];
    pool.query.mockResolvedValue({ rows });

    // WHEN
    const result = await repository.findByStatus('pending', 20, 0);

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('WHERE ts.status = $1');
    expect(pool.query.mock.calls[0][1]).toEqual(['pending', 20, 0]);
    expect(result).toEqual(rows);
  });

  it('test_countByStatus_returns_total', async () => {
    // GIVEN
    pool.query.mockResolvedValue({ rows: [{ total: 7 }] });

    // WHEN
    const result = await repository.countByStatus('pending');

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('COUNT(*)::int AS total');
    expect(pool.query.mock.calls[0][1]).toEqual(['pending']);
    expect(result).toBe(7);
  });

  it('test_countPendingByUser_returns_total', async () => {
    // GIVEN
    pool.query.mockResolvedValue({ rows: [{ total: 3 }] });

    // WHEN
    const result = await repository.countPendingByUser('u1');

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain("status = 'pending'");
    expect(pool.query.mock.calls[0][1]).toEqual(['u1']);
    expect(result).toBe(3);
  });

  it('test_updateStatus_updates_and_returns_row', async () => {
    // GIVEN
    const updated = { id: 's1', status: 'rejected' };
    pool.query.mockResolvedValue({ rows: [updated] });

    // WHEN
    const result = await repository.updateStatus('s1', 'rejected', 'admin-1', 'No aplica');

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('SET status = $1, reviewed_by = $2');
    expect(pool.query.mock.calls[0][1]).toEqual(['rejected', 'admin-1', 'No aplica', 's1']);
    expect(result).toEqual(updated);
  });

  it('test_existsByText_queries_case_insensitive_in_terms_and_pending', async () => {
    // GIVEN
    pool.query.mockResolvedValue({ rows: [{ exists: true }] });

    // WHEN
    const result = await repository.existsByText('Pikachu');

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('LOWER(text) = LOWER($1)');
    expect(pool.query.mock.calls[0][0]).toContain('term_suggestions');
    expect(pool.query.mock.calls[0][1]).toEqual(['Pikachu']);
    expect(result).toBe(true);
  });
});
