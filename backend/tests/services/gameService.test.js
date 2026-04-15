const GameService = require('../../src/services/gameService');

describe('GameService', () => {
  let termRepository;
  let service;

  beforeEach(() => {
    termRepository = {
      getRandomTerms: jest.fn(),
    };
    service = new GameService(termRepository);
  });

  it('test_getRandomTerms_returns_n_terms_from_repo', async () => {
    // GIVEN
    const terms = [{ id: '1', text: 'Pikachu', category: 'pokemon' }];
    termRepository.getRandomTerms.mockResolvedValue(terms);

    // WHEN
    const result = await service.getRandomTerms(1, []);

    // THEN
    expect(termRepository.getRandomTerms).toHaveBeenCalledWith(1, []);
    expect(result).toEqual(terms);
  });

  it('test_getRandomTerms_throws_error_if_count_less_or_equal_zero', async () => {
    // GIVEN
    const count = 0;

    // WHEN
    const promise = service.getRandomTerms(count, []);

    // THEN
    await expect(promise).rejects.toMatchObject({
      statusCode: 400,
      message: 'El par\u00e1metro count debe ser un entero mayor a 0',
    });
  });

  it('test_getRandomTerms_throws_error_if_count_greater_than_twenty', async () => {
    // GIVEN
    const count = 21;

    // WHEN
    const promise = service.getRandomTerms(count, []);

    // THEN
    await expect(promise).rejects.toMatchObject({
      statusCode: 400,
      message: 'El par\u00e1metro count no puede superar 20',
    });
  });
});
