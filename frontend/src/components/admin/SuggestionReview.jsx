import styles from './SuggestionReview.module.css';

export default function SuggestionReview({ suggestions = [], onApprove, onReject, loading }) {
  if (!suggestions.length && !loading) {
    return (
      <div data-testid="suggestion-review" className={styles.wrapper}>
        <p className={styles.empty}>No hay sugerencias pendientes.</p>
      </div>
    );
  }

  return (
    <div data-testid="suggestion-review" className={styles.wrapper}>
      {loading && <p className={styles.loading}>Cargando sugerencias…</p>}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Texto</th>
              <th>Categoría</th>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {suggestions.map((s) => (
              <tr key={s.id}>
                <td>{s.text}</td>
                <td>{s.category}</td>
                <td>{s.username ?? s.user?.username ?? '—'}</td>
                <td>
                  {s.created_at
                    ? new Date(s.created_at).toLocaleDateString('es-VE')
                    : '—'}
                </td>
                <td>
                  <span
                    className={
                      s.status === 'approved'
                        ? styles.badgeApproved
                        : s.status === 'rejected'
                        ? styles.badgeRejected
                        : styles.badgePending
                    }
                  >
                    {s.status === 'approved'
                      ? 'Aprobado'
                      : s.status === 'rejected'
                      ? 'Rechazado'
                      : 'Pendiente'}
                  </span>
                </td>
                <td className={styles.actions}>
                  {s.status === 'pending' && (
                    <>
                      <button
                        className={styles.btnApprove}
                        onClick={() => onApprove(s.id)}
                        disabled={loading}
                      >
                        Aprobar
                      </button>
                      <button
                        className={styles.btnReject}
                        onClick={() => onReject(s.id)}
                        disabled={loading}
                      >
                        Rechazar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
