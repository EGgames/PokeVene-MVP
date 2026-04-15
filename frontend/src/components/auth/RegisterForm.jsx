import { useState } from 'react';
import styles from './RegisterForm.module.css';

const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

function validateFields(username, password, confirmPassword) {
  const errors = {};
  if (!username) {
    errors.username = 'El nombre de usuario es requerido.';
  } else if (!USERNAME_REGEX.test(username)) {
    errors.username =
      'El usuario debe tener entre 3 y 20 caracteres (letras, números, - y _).';
  }
  if (!password) {
    errors.password = 'La contraseña es requerida.';
  } else if (password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres.';
  }
  if (!confirmPassword) {
    errors.confirmPassword = 'Debes confirmar la contraseña.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden.';
  }
  return errors;
}

/**
 * Formulario de registro de usuario.
 * @param {{ onSubmit: (username: string, password: string) => Promise<void>, isLoading: boolean, error: string|null }} props
 */
export default function RegisterForm({ onSubmit, isLoading, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validateFields(username, password, confirmPassword);
    setFieldErrors(errs);
  }

  function handleChange(field, value) {
    if (field === 'username') setUsername(value);
    if (field === 'password') setPassword(value);
    if (field === 'confirmPassword') setConfirmPassword(value);

    if (touched[field]) {
      const updated = {
        username: field === 'username' ? value : username,
        password: field === 'password' ? value : password,
        confirmPassword: field === 'confirmPassword' ? value : confirmPassword,
      };
      const errs = validateFields(updated.username, updated.password, updated.confirmPassword);
      setFieldErrors(errs);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const allTouched = { username: true, password: true, confirmPassword: true };
    setTouched(allTouched);
    const errs = validateFields(username, password, confirmPassword);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    await onSubmit(username, password);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="reg-username" className={styles.label}>
          Nombre de usuario
        </label>
        <input
          id="reg-username"
          type="text"
          className={`${styles.input} ${touched.username && fieldErrors.username ? styles.inputError : ''}`}
          value={username}
          onChange={(e) => handleChange('username', e.target.value)}
          onBlur={() => handleBlur('username')}
          autoComplete="username"
          maxLength={20}
          disabled={isLoading}
        />
        {touched.username && fieldErrors.username && (
          <span className={styles.errorText}>{fieldErrors.username}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="reg-password" className={styles.label}>
          Contraseña
        </label>
        <input
          id="reg-password"
          type="password"
          className={`${styles.input} ${touched.password && fieldErrors.password ? styles.inputError : ''}`}
          value={password}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
          autoComplete="new-password"
          disabled={isLoading}
        />
        {touched.password && fieldErrors.password && (
          <span className={styles.errorText}>{fieldErrors.password}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="reg-confirm-password" className={styles.label}>
          Confirmar contraseña
        </label>
        <input
          id="reg-confirm-password"
          type="password"
          className={`${styles.input} ${touched.confirmPassword && fieldErrors.confirmPassword ? styles.inputError : ''}`}
          value={confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          onBlur={() => handleBlur('confirmPassword')}
          autoComplete="new-password"
          disabled={isLoading}
        />
        {touched.confirmPassword && fieldErrors.confirmPassword && (
          <span className={styles.errorText}>{fieldErrors.confirmPassword}</span>
        )}
      </div>

      {error && <p className={styles.backendError} data-testid="reg-error">{error}</p>}

      <button id="reg-submit" type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? <span className={styles.spinner} aria-label="Cargando" /> : 'Crear Cuenta'}
      </button>
    </form>
  );
}
