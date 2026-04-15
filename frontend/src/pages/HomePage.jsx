import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.logo}>PokeVene</h1>
        <p className={styles.tagline}>El juego Pokémon de Venezuela</p>

        <div className={styles.actions}>
          <button
            id="home-login-btn"
            type="button"
            className={styles.primaryButton}
            onClick={() => navigate('/login')}
          >
            Iniciar Sesión
          </button>
          <button
            id="home-register-btn"
            type="button"
            className={styles.secondaryButton}
            onClick={() => navigate('/register')}
          >
            Registrarse
          </button>
          <button
            id="home-guest-btn"
            type="button"
            className={styles.guestButton}
            onClick={() => navigate('/game')}
          >
            Jugar como Invitado
          </button>
        </div>
      </div>
    </div>
  );
}
