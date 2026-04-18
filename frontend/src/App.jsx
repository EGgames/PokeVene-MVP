import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import ProtectedRoute from './components/routing/ProtectedRoute';
import GamePage from './pages/GamePage';
import GameResultPage from './pages/GameResultPage';
import HomePage from './pages/HomePage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
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
            {/* Rutas protegidas */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminPage />
                </AdminProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
