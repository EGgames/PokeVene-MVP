import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(username, password) {
    setIsLoading(true);
    setError(null);
    try {
      await login(username, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleGuestPlay() {
    navigate('/game');
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Iniciar sesión</h1>
        <p className={styles.subtitle}>Bienvenido de vuelta a PokeVene</p>

        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

        <button
          type="button"
          className={styles.guestButton}
          onClick={handleGuestPlay}
          disabled={isLoading}
        >
          Jugar como Invitado
        </button>

        <p className={styles.footer}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className={styles.link}>
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
