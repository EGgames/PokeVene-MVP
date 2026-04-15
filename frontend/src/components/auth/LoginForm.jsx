import { useState } from 'react';
import styles from './LoginForm.module.css';

const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

function validateFields(username, password) {
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
  return errors;
}

/**
 * Formulario de inicio de sesión.
 * @param {{ onSubmit: (username: string, password: string) => Promise<void>, isLoading: boolean, error: string|null }} props
 */
export default function LoginForm({ onSubmit, isLoading, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validateFields(username, password);
    setFieldErrors(errs);
  }

  function handleChange(field, value) {
    if (field === 'username') setUsername(value);
    if (field === 'password') setPassword(value);

    if (touched[field]) {
      const updated = {
        username: field === 'username' ? value : username,
        password: field === 'password' ? value : password,
      };
      const errs = validateFields(updated.username, updated.password);
      setFieldErrors(errs);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const allTouched = { username: true, password: true };
    setTouched(allTouched);
    const errs = validateFields(username, password);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    await onSubmit(username, password);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="login-username" className={styles.label}>
          Nombre de usuario
        </label>
        <input
          id="login-username"
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
        <label htmlFor="login-password" className={styles.label}>
          Contraseña
        </label>
        <input
          id="login-password"
          type="password"
          className={`${styles.input} ${touched.password && fieldErrors.password ? styles.inputError : ''}`}
          value={password}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
          autoComplete="current-password"
          disabled={isLoading}
        />
        {touched.password && fieldErrors.password && (
          <span className={styles.errorText}>{fieldErrors.password}</span>
        )}
      </div>

      {error && <p className={styles.backendError} data-testid="login-error">{error}</p>}

      <button id="login-submit" type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? <span className={styles.spinner} aria-label="Cargando" /> : 'Iniciar Sesión'}
      </button>
    </form>
  );
}
