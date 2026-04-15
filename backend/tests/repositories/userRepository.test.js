const UserRepository = require('../../src/repositories/userRepository');

describe('UserRepository', () => {
  let pool;
  let repository;

  beforeEach(() => {
    pool = {
      query: jest.fn(),
    };
    repository = new UserRepository(pool);
  });

  it('test_create_inserts_and_returns_created_user', async () => {
    // GIVEN
    const created = { id: 'u1', username: 'poke' };
    pool.query.mockResolvedValue({ rows: [created] });

    // WHEN
    const result = await repository.create('poke', 'hash');

    // THEN
    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(pool.query.mock.calls[0][0]).toContain('INSERT INTO users');
    expect(pool.query.mock.calls[0][1]).toEqual(['poke', 'hash']);
    expect(result).toEqual(created);
  });

  it('test_findByUsername_returns_user_when_exists', async () => {
    // GIVEN
    const row = { id: 'u1', username: 'poke', password_hash: 'hash' };
    pool.query.mockResolvedValue({ rows: [row] });

    // WHEN
    const result = await repository.findByUsername('poke');

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('LOWER(username) = LOWER($1)');
    expect(pool.query.mock.calls[0][1]).toEqual(['poke']);
    expect(result).toEqual(row);
  });

  it('test_findByUsername_returns_null_when_not_found', async () => {
    // GIVEN
    pool.query.mockResolvedValue({ rows: [] });

    // WHEN
    const result = await repository.findByUsername('missing');

    // THEN
    expect(result).toBeNull();
  });

  it('test_findById_returns_user_when_exists', async () => {
    // GIVEN
    const row = { id: 'u1', username: 'poke' };
    pool.query.mockResolvedValue({ rows: [row] });

    // WHEN
    const result = await repository.findById('u1');

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('WHERE id = $1');
    expect(pool.query.mock.calls[0][1]).toEqual(['u1']);
    expect(result).toEqual(row);
  });

  it('test_findById_returns_null_when_not_found', async () => {
    // GIVEN
    pool.query.mockResolvedValue({ rows: [] });

    // WHEN
    const result = await repository.findById('missing');

    // THEN
    expect(result).toBeNull();
  });
});
