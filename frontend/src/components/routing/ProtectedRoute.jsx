import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './ProtectedRoute.module.css';

/**
 * Wrapper para rutas protegidas.
 * - Si está cargando: muestra spinner.
 * - Si no está autenticado: redirige a /login.
 * - Si está autenticado: renderiza los children.
 *
 * @param {{ children: React.ReactNode, redirectTo?: string }} props
 */
export default function ProtectedRoute({ children, redirectTo = '/login' }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={styles.loadingContainer} aria-label="Verificando sesión">
        <span className={styles.spinner} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
