// Models / DTOs: Validación de input para autenticación (SPEC-002)

const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;
const USERNAME_MIN = 3;
const USERNAME_MAX = 20;
const PASSWORD_MIN = 8;

/**
 * Valida los campos de entrada para el registro de usuario.
 * @param {string} username
 * @param {string} password
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateRegisterInput(username, password) {
  const errors = [];

  if (!username) {
    errors.push('El campo username es requerido');
  } else if (username.length < USERNAME_MIN || username.length > USERNAME_MAX) {
    errors.push(`El username debe tener entre ${USERNAME_MIN} y ${USERNAME_MAX} caracteres`);
  } else if (!USERNAME_REGEX.test(username)) {
    errors.push('El username solo puede contener letras, números, guiones y guiones bajos');
  }

  if (!password) {
    errors.push('El campo password es requerido');
  } else if (password.length < PASSWORD_MIN) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Valida los campos de entrada para el login de usuario.
 * @param {string} username
 * @param {string} password
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateLoginInput(username, password) {
  const errors = [];

  if (!username) {
    errors.push('El campo username es requerido');
  }

  if (!password) {
    errors.push('El campo password es requerido');
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateRegisterInput, validateLoginInput };
