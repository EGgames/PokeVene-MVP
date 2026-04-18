const SuggestionService = require('../../src/services/suggestionService');

describe('SuggestionService', () => {
  let suggestionRepository;
  let settingsRepository;
  let service;

  beforeEach(() => {
    suggestionRepository = {
      countPendingByUser: jest.fn(),
      existsByText: jest.fn(),
      create: jest.fn(),
      findByUserId: jest.fn(),
    };

    settingsRepository = {
      get: jest.fn(),
    };

    service = new SuggestionService(suggestionRepository, settingsRepository);
  });

  it('test_createSuggestion_success_creates_pending_suggestion', async () => {
    // GIVEN
    settingsRepository.get.mockResolvedValue('10');
    suggestionRepository.countPendingByUser.mockResolvedValue(1);
    suggestionRepository.existsByText.mockResolvedValue(false);
    suggestionRepository.create.mockResolvedValue({
      id: 's1',
      user_id: 'u1',
      text: 'Typhlosion',
      category: 'pokemon',
      status: 'pending',
    });

    // WHEN
    const result = await service.createSuggestion('u1', 12, ' Typhlosion ', 'pokemon');

    // THEN
    expect(suggestionRepository.countPendingByUser).toHaveBeenCalledWith('u1');
    expect(suggestionRepository.existsByText).toHaveBeenCalledWith('Typhlosion');
    expect(suggestionRepository.create).toHaveBeenCalledWith('u1', 'Typhlosion', 'pokemon');
    expect(result).toMatchObject({ id: 's1', status: 'pending' });
  });

  it('test_createSuggestion_insufficient_level_throws_403', async () => {
    // GIVEN
    settingsRepository.get.mockResolvedValue('10');

    // WHEN
    const promise = service.createSuggestion('u1', 9, 'Typhlosion', 'pokemon');

    // THEN
    await expect(promise).rejects.toMatchObject({
      statusCode: 403,
      message: 'Necesitas nivel 10 para sugerir t\u00e9rminos',
    });
  });

  it('test_createSuggestion_max_pending_reached_throws_error', async () => {
    // GIVEN
    settingsRepository.get.mockResolvedValue('10');
    suggestionRepository.countPendingByUser.mockResolvedValue(5);

    // WHEN
    const promise = service.createSuggestion('u1', 15, 'Typhlosion', 'pokemon');

    // THEN
    await expect(promise).rejects.toMatchObject({
      statusCode: 409,
      message: 'Ya tienes 5 sugerencias pendientes. Espera a que sean revisadas',
    });
  });

  it('test_createSuggestion_duplicate_term_throws_409', async () => {
    // GIVEN
    settingsRepository.get.mockResolvedValue('10');
    suggestionRepository.countPendingByUser.mockResolvedValue(0);
    suggestionRepository.existsByText.mockResolvedValue(true);

    // WHEN
    const promise = service.createSuggestion('u1', 12, 'Pikachu', 'pokemon');

    // THEN
    await expect(promise).rejects.toMatchObject({
      statusCode: 409,
      message: 'Este t\u00e9rmino ya existe o ya fue sugerido',
    });
  });

  it('test_getUserSuggestions_returns_user_suggestions', async () => {
    // GIVEN
    const suggestions = [{ id: 's1' }, { id: 's2' }];
    suggestionRepository.findByUserId.mockResolvedValue(suggestions);

    // WHEN
    const result = await service.getUserSuggestions('u1');

    // THEN
    expect(suggestionRepository.findByUserId).toHaveBeenCalledWith('u1');
    expect(result).toEqual(suggestions);
  });
});
