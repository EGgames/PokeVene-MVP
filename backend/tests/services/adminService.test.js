const AdminService = require('../../src/services/adminService');

describe('AdminService', () => {
  let adminRepository;
  let termRepository;
  let suggestionRepository;
  let settingsRepository;
  let pool;
  let service;

  beforeEach(() => {
    adminRepository = {
      listUsers: jest.fn(),
      countUsers: jest.fn(),
      updateUserRole: jest.fn(),
      findUserById: jest.fn(),
      banUser: jest.fn(),
      unbanUser: jest.fn(),
    };

    termRepository = {
      create: jest.fn(),
      deleteById: jest.fn(),
    };

    suggestionRepository = {
      findByStatus: jest.fn(),
      countByStatus: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };

    settingsRepository = {
      getAll: jest.fn(),
      set: jest.fn(),
    };

    pool = {
      connect: jest.fn(),
    };

    service = new AdminService(
      adminRepository,
      termRepository,
      suggestionRepository,
      settingsRepository,
      pool
    );
  });

  it('test_listUsers_calls_repo_with_expected_params', async () => {
    // GIVEN
    adminRepository.listUsers.mockResolvedValue([{ id: 'u1' }]);
    adminRepository.countUsers.mockResolvedValue(1);

    // WHEN
    const result = await service.listUsers(20, 0, 'poke');

    // THEN
    expect(adminRepository.listUsers).toHaveBeenCalledWith(20, 0, 'poke');
    expect(adminRepository.countUsers).toHaveBeenCalledWith('poke');
    expect(result).toEqual({ users: [{ id: 'u1' }], total: 1 });
  });

  it('test_updateUserRole_success_returns_updated_user', async () => {
    // GIVEN
    const updated = { id: 'u2', role: 'admin' };
    adminRepository.updateUserRole.mockResolvedValue(updated);

    // WHEN
    const result = await service.updateUserRole('admin-1', 'u2', 'admin');

    // THEN
    expect(adminRepository.updateUserRole).toHaveBeenCalledWith('u2', 'admin');
    expect(result).toEqual(updated);
  });

  it('test_updateUserRole_same_user_throws_403', async () => {
    // WHEN
    const promise = service.updateUserRole('u1', 'u1', 'user');

    // THEN
    await expect(promise).rejects.toMatchObject({
      statusCode: 403,
      message: 'No puedes cambiar tu propio rol',
    });
  });

  it('test_updateUserRole_user_not_found_throws_404', async () => {
    // GIVEN
    adminRepository.updateUserRole.mockResolvedValue(null);

    // WHEN
    const promise = service.updateUserRole('admin-1', 'missing', 'admin');

    // THEN
    await expect(promise).rejects.toMatchObject({ statusCode: 404 });
  });

  it('test_banUser_success_returns_message', async () => {
    // GIVEN
    adminRepository.findUserById.mockResolvedValue({ id: 'u2' });
    adminRepository.banUser.mockResolvedValue({ id: 'u2' });

    // WHEN
    const result = await service.banUser('admin-1', 'u2');

    // THEN
    expect(adminRepository.findUserById).toHaveBeenCalledWith('u2');
    expect(adminRepository.banUser).toHaveBeenCalledWith('u2');
    expect(result).toEqual({ message: 'Usuario baneado exitosamente' });
  });

  it('test_banUser_same_user_throws_403', async () => {
    // WHEN
    const promise = service.banUser('u1', 'u1');

    // THEN
    await expect(promise).rejects.toMatchObject({ statusCode: 403 });
  });

  it('test_banUser_user_not_found_throws_404', async () => {
    // GIVEN
    adminRepository.findUserById.mockResolvedValue(null);

    // WHEN
    const promise = service.banUser('admin-1', 'missing');

    // THEN
    await expect(promise).rejects.toMatchObject({ statusCode: 404 });
  });

  it('test_unbanUser_success_returns_message', async () => {
    // GIVEN
    adminRepository.findUserById.mockResolvedValue({ id: 'u2' });
    adminRepository.unbanUser.mockResolvedValue({ id: 'u2' });

    // WHEN
    const result = await service.unbanUser('u2');

    // THEN
    expect(adminRepository.unbanUser).toHaveBeenCalledWith('u2');
    expect(result).toEqual({ message: 'Usuario desbaneado exitosamente' });
  });

  it('test_unbanUser_user_not_found_throws_404', async () => {
    // GIVEN
    adminRepository.findUserById.mockResolvedValue(null);

    // WHEN
    const promise = service.unbanUser('missing');

    // THEN
    await expect(promise).rejects.toMatchObject({ statusCode: 404 });
  });

  it('test_addTerm_success_returns_created_term', async () => {
    // GIVEN
    const created = { id: 't1', text: 'Totodile', category: 'pokemon' };
    termRepository.create.mockResolvedValue(created);

    // WHEN
    const result = await service.addTerm(' Totodile ', 'pokemon');

    // THEN
    expect(termRepository.create).toHaveBeenCalledWith('Totodile', 'pokemon');
    expect(result).toEqual(created);
  });

  it('test_addTerm_duplicate_throws_409', async () => {
    // GIVEN
    const err = new Error('duplicate');
    err.code = '23505';
    termRepository.create.mockRejectedValue(err);

    // WHEN
    const promise = service.addTerm('Pikachu', 'pokemon');

    // THEN
    await expect(promise).rejects.toMatchObject({
      statusCode: 409,
      message: 'El t\u00e9rmino ya existe',
    });
  });

  it('test_deleteTerm_success_calls_repo', async () => {
    // GIVEN
    termRepository.deleteById.mockResolvedValue({ id: 't1' });

    // WHEN
    await service.deleteTerm('t1');

    // THEN
    expect(termRepository.deleteById).toHaveBeenCalledWith('t1');
  });

  it('test_deleteTerm_not_found_throws_404', async () => {
    // GIVEN
    termRepository.deleteById.mockResolvedValue(null);

    // WHEN
    const promise = service.deleteTerm('missing');

    // THEN
    await expect(promise).rejects.toMatchObject({ statusCode: 404 });
  });

  it('test_listSuggestions_calls_repo_with_pending_status', async () => {
    // GIVEN
    suggestionRepository.findByStatus.mockResolvedValue([{ id: 's1' }]);
    suggestionRepository.countByStatus.mockResolvedValue(1);

    // WHEN
    const result = await service.listSuggestions('pending', 20, 0);

    // THEN
    expect(suggestionRepository.findByStatus).toHaveBeenCalledWith('pending', 20, 0);
    expect(suggestionRepository.countByStatus).toHaveBeenCalledWith('pending');
    expect(result).toEqual({ suggestions: [{ id: 's1' }], total: 1 });
  });

  it('test_listSuggestions_calls_repo_with_rejected_status', async () => {
    // GIVEN
    suggestionRepository.findByStatus.mockResolvedValue([]);
    suggestionRepository.countByStatus.mockResolvedValue(0);

    // WHEN
    const result = await service.listSuggestions('rejected', 5, 10);

    // THEN
    expect(suggestionRepository.findByStatus).toHaveBeenCalledWith('rejected', 5, 10);
    expect(suggestionRepository.countByStatus).toHaveBeenCalledWith('rejected');
    expect(result).toEqual({ suggestions: [], total: 0 });
  });

  it('test_reviewSuggestion_approved_creates_term_in_transaction', async () => {
    // GIVEN
    suggestionRepository.findById.mockResolvedValue({
      id: 's1',
      text: 'Typhlosion',
      category: 'pokemon',
      status: 'pending',
    });

    const client = {
      query: jest.fn().mockResolvedValue({}),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(client);

    // WHEN
    const result = await service.reviewSuggestion('s1', 'approved', 'admin-1', null);

    // THEN
    expect(pool.connect).toHaveBeenCalledTimes(1);
    expect(client.query).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(client.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('UPDATE term_suggestions'),
      ['approved', 'admin-1', null, 's1']
    );
    expect(client.query).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining('INSERT INTO terms'),
      ['Typhlosion', 'pokemon']
    );
    expect(client.query).toHaveBeenNthCalledWith(4, 'COMMIT');
    expect(client.release).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ message: 'Sugerencia aprobada y t\u00e9rmino creado exitosamente' });
  });

  it('test_reviewSuggestion_rejected_updates_status_with_note', async () => {
    // GIVEN
    suggestionRepository.findById.mockResolvedValue({
      id: 's1',
      status: 'pending',
    });
    suggestionRepository.updateStatus.mockResolvedValue({
      id: 's1',
      status: 'rejected',
      review_note: 'No aplica',
    });

    // WHEN
    const result = await service.reviewSuggestion('s1', 'rejected', 'admin-1', 'No aplica');

    // THEN
    expect(suggestionRepository.updateStatus).toHaveBeenCalledWith(
      's1',
      'rejected',
      'admin-1',
      'No aplica'
    );
    expect(result).toEqual({ id: 's1', status: 'rejected', review_note: 'No aplica' });
  });

  it('test_reviewSuggestion_not_found_throws_404', async () => {
    // GIVEN
    suggestionRepository.findById.mockResolvedValue(null);

    // WHEN
    const promise = service.reviewSuggestion('missing', 'approved', 'admin-1', null);

    // THEN
    await expect(promise).rejects.toMatchObject({ statusCode: 404 });
  });

  it('test_getSettings_returns_object', async () => {
    // GIVEN
    settingsRepository.getAll.mockResolvedValue({ suggestion_level_threshold: '10' });

    // WHEN
    const result = await service.getSettings();

    // THEN
    expect(result).toEqual({ suggestion_level_threshold: '10' });
  });

  it('test_updateSettings_success_persists_threshold', async () => {
    // GIVEN
    settingsRepository.set.mockResolvedValue({ key: 'suggestion_level_threshold', value: '15' });

    // WHEN
    const result = await service.updateSettings({ suggestion_level_threshold: 15 }, 'admin-1');

    // THEN
    expect(settingsRepository.set).toHaveBeenCalledWith('suggestion_level_threshold', '15', 'admin-1');
    expect(result).toEqual({
      suggestion_level_threshold: { key: 'suggestion_level_threshold', value: '15' },
    });
  });

  it('test_updateSettings_invalid_threshold_below_range_throws_400', async () => {
    // WHEN
    const promise = service.updateSettings({ suggestion_level_threshold: 0 }, 'admin-1');

    // THEN
    await expect(promise).rejects.toMatchObject({ statusCode: 400 });
  });

  it('test_updateSettings_invalid_threshold_above_range_throws_400', async () => {
    // WHEN
    const promise = service.updateSettings({ suggestion_level_threshold: 101 }, 'admin-1');

    // THEN
    await expect(promise).rejects.toMatchObject({ statusCode: 400 });
  });
});
