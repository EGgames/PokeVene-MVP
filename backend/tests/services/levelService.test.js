const { calculateXpGained, calculateLevel } = require('../../src/services/levelService');

describe('levelService', () => {
  it('test_calculateXpGained_100_returns_100', () => {
    // WHEN
    const result = calculateXpGained(100);

    // THEN
    expect(result).toBe(100);
  });

  it('test_calculateXpGained_0_returns_0', () => {
    // WHEN
    const result = calculateXpGained(0);

    // THEN
    expect(result).toBe(0);
  });

  it('test_calculateXpGained_decimal_rounds_value', () => {
    // WHEN
    const result = calculateXpGained(75.5);

    // THEN
    expect(result).toBe(76);
  });

  it('test_calculateLevel_0_returns_1', () => {
    // WHEN
    const result = calculateLevel(0);

    // THEN
    expect(result).toBe(1);
  });

  it('test_calculateLevel_99_returns_1', () => {
    // WHEN
    const result = calculateLevel(99);

    // THEN
    expect(result).toBe(1);
  });

  it('test_calculateLevel_100_returns_2', () => {
    // WHEN
    const result = calculateLevel(100);

    // THEN
    expect(result).toBe(2);
  });

  it('test_calculateLevel_550_returns_6', () => {
    // WHEN
    const result = calculateLevel(550);

    // THEN
    expect(result).toBe(6);
  });
});
