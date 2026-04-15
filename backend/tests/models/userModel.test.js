const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../src/models/userModel');

describe('userModel validations', () => {
  it('test_validateRegisterInput_valid_input_returns_valid_true', () => {
    // GIVEN
    const username = 'poke_fan-123';
    const password = 'Password123';

    // WHEN
    const result = validateRegisterInput(username, password);

    // THEN
    expect(result).toEqual({ valid: true, errors: [] });
  });

  it('test_validateRegisterInput_missing_username_returns_error', () => {
    // GIVEN
    const username = '';
    const password = 'Password123';

    // WHEN
    const result = validateRegisterInput(username, password);

    // THEN
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('El campo username es requerido');
  });

  it('test_validateRegisterInput_username_too_short_returns_error', () => {
    // GIVEN
    const username = 'ab';
    const password = 'Password123';

    // WHEN
    const result = validateRegisterInput(username, password);

    // THEN
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('entre 3 y 20 caracteres');
  });

  it('test_validateRegisterInput_username_too_long_returns_error', () => {
    // GIVEN
    const username = 'a'.repeat(21);
    const password = 'Password123';

    // WHEN
    const result = validateRegisterInput(username, password);

    // THEN
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('entre 3 y 20 caracteres');
  });

  it('test_validateRegisterInput_invalid_username_chars_returns_error', () => {
    // GIVEN
    const username = 'poke fan!';
    const password = 'Password123';

    // WHEN
    const result = validateRegisterInput(username, password);

    // THEN
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('solo puede contener letras, n\u00fameros, guiones y guiones bajos');
  });

  it('test_validateRegisterInput_password_too_short_returns_error', () => {
    // GIVEN
    const username = 'poke_fan';
    const password = '1234567';

    // WHEN
    const result = validateRegisterInput(username, password);

    // THEN
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('La contrase\u00f1a debe tener al menos 8 caracteres');
  });

  it('test_validateLoginInput_valid_input_returns_valid_true', () => {
    // GIVEN
    const username = 'pokefan123';
    const password = 'Password123';

    // WHEN
    const result = validateLoginInput(username, password);

    // THEN
    expect(result).toEqual({ valid: true, errors: [] });
  });

  it('test_validateLoginInput_missing_fields_returns_errors', () => {
    // GIVEN
    const username = '';
    const password = '';

    // WHEN
    const result = validateLoginInput(username, password);

    // THEN
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('El campo username es requerido');
    expect(result.errors).toContain('El campo password es requerido');
  });
});
