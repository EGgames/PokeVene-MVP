import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import GamePage from './pages/GamePage';
import GameResultPage from './pages/GameResultPage';
import HomePage from './pages/HomePage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import styles from './App.module.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className={styles.app}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Rutas de juego — accesibles sin autenticación */}
            <Route path="/game" element={<GamePage />} />
            <Route path="/game-result" element={<GameResultPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
