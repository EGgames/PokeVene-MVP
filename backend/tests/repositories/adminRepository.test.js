const AdminRepository = require('../../src/repositories/adminRepository');

describe('AdminRepository', () => {
  let pool;
  let repository;

  beforeEach(() => {
    pool = { query: jest.fn() };
    repository = new AdminRepository(pool);
  });

  it('test_listUsers_queries_with_limit_offset_and_search', async () => {
    // GIVEN
    pool.query.mockResolvedValue({ rows: [{ id: 'u1' }] });

    // WHEN
    const result = await repository.listUsers(20, 0, 'poke');

    // THEN
    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(pool.query.mock.calls[0][0]).toContain('FROM users');
    expect(pool.query.mock.calls[0][0]).toContain('username ILIKE');
    expect(pool.query.mock.calls[0][1]).toEqual([20, 0, '%poke%']);
    expect(result).toEqual([{ id: 'u1' }]);
  });

  it('test_countUsers_queries_total_with_search', async () => {
    // GIVEN
    pool.query.mockResolvedValue({ rows: [{ total: 4 }] });

    // WHEN
    const result = await repository.countUsers('ash');

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('COUNT(*)::int AS total');
    expect(pool.query.mock.calls[0][1]).toEqual(['%ash%']);
    expect(result).toBe(4);
  });

  it('test_findUserById_queries_by_id', async () => {
    // GIVEN
    pool.query.mockResolvedValue({ rows: [{ id: 'u1' }] });

    // WHEN
    const result = await repository.findUserById('u1');

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('WHERE id = $1');
    expect(pool.query.mock.calls[0][1]).toEqual(['u1']);
    expect(result).toEqual({ id: 'u1' });
  });

  it('test_updateUserRole_queries_sql_and_params', async () => {
    // GIVEN
    pool.query.mockResolvedValue({ rows: [{ id: 'u1', role: 'admin' }] });

    // WHEN
    const result = await repository.updateUserRole('u1', 'admin');

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('SET role = $1');
    expect(pool.query.mock.calls[0][1]).toEqual(['admin', 'u1']);
    expect(result).toEqual({ id: 'u1', role: 'admin' });
  });

  it('test_banUser_queries_sql_and_params', async () => {
    // GIVEN
    pool.query.mockResolvedValue({ rows: [{ id: 'u1', banned_at: '2026-01-01T00:00:00.000Z' }] });

    // WHEN
    const result = await repository.banUser('u1');

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('SET banned_at = NOW()');
    expect(pool.query.mock.calls[0][1]).toEqual(['u1']);
    expect(result).toEqual({ id: 'u1', banned_at: '2026-01-01T00:00:00.000Z' });
  });

  it('test_unbanUser_queries_sql_and_params', async () => {
    // GIVEN
    pool.query.mockResolvedValue({ rows: [{ id: 'u1', banned_at: null }] });

    // WHEN
    const result = await repository.unbanUser('u1');

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('SET banned_at = NULL');
    expect(pool.query.mock.calls[0][1]).toEqual(['u1']);
    expect(result).toEqual({ id: 'u1', banned_at: null });
  });

  it('test_updateUserXpAndLevel_queries_sql_and_params', async () => {
    // GIVEN
    pool.query.mockResolvedValue({ rows: [{ id: 'u1', xp: 120, level: 1 }] });

    // WHEN
    const result = await repository.updateUserXpAndLevel('u1', 120, 1);

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('SET xp = $1, level = $2');
    expect(pool.query.mock.calls[0][1]).toEqual([120, 1, 'u1']);
    expect(result).toEqual({ id: 'u1', xp: 120, level: 1 });
  });
});
