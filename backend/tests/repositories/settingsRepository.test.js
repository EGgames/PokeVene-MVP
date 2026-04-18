const SettingsRepository = require('../../src/repositories/settingsRepository');

describe('SettingsRepository', () => {
  let pool;
  let repository;

  beforeEach(() => {
    pool = { query: jest.fn() };
    repository = new SettingsRepository(pool);
  });

  it('test_getAll_converts_rows_to_object', async () => {
    // GIVEN
    pool.query.mockResolvedValue({
      rows: [
        { key: 'suggestion_level_threshold', value: '10' },
        { key: 'feature_flag_x', value: 'true' },
      ],
    });

    // WHEN
    const result = await repository.getAll();

    // THEN
    expect(pool.query).toHaveBeenCalledWith('SELECT key, value FROM settings');
    expect(result).toEqual({
      suggestion_level_threshold: '10',
      feature_flag_x: 'true',
    });
  });

  it('test_get_returns_value_when_exists', async () => {
    // GIVEN
    pool.query.mockResolvedValue({ rows: [{ value: '15' }] });

    // WHEN
    const result = await repository.get('suggestion_level_threshold');

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('SELECT value FROM settings WHERE key = $1');
    expect(pool.query.mock.calls[0][1]).toEqual(['suggestion_level_threshold']);
    expect(result).toBe('15');
  });

  it('test_set_upserts_setting_and_returns_row', async () => {
    // GIVEN
    const saved = { key: 'suggestion_level_threshold', value: '20' };
    pool.query.mockResolvedValue({ rows: [saved] });

    // WHEN
    const result = await repository.set('suggestion_level_threshold', '20', 'admin-1');

    // THEN
    expect(pool.query.mock.calls[0][0]).toContain('ON CONFLICT (key) DO UPDATE');
    expect(pool.query.mock.calls[0][1]).toEqual(['suggestion_level_threshold', '20', 'admin-1']);
    expect(result).toEqual(saved);
  });
});
