import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './routing/ProtectedRoute.module.css';

/**
 * Ruta protegida que además verifica rol de administrador.
 * - Si cargando: muestra spinner.
 * - Si no autenticado: redirige a /login.
 * - Si no es admin: redirige a /dashboard.
 * - Si es admin: renderiza los children.
 */
export default function AdminProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div
        data-testid="admin-protected-route"
        className={styles.loadingContainer}
        aria-label="Verificando permisos"
      >
        <span className={styles.spinner} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
