import { useState } from 'react';
import styles from './UserTable.module.css';

export default function UserTable({ users = [], onBan, onUnban, onRoleChange, loading }) {
  const [search, setSearch] = useState('');

  const filtered = users.filter((u) =>
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div data-testid="user-table" className={styles.wrapper}>
      <div className={styles.toolbar}>
        <input
          data-testid="user-search"
          type="text"
          className={styles.search}
          placeholder="Buscar usuario…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p className={styles.loading}>Cargando usuarios…</p>}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Nivel</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.level ?? 0}</td>
                <td>
                  <select
                    className={styles.roleSelect}
                    value={u.role ?? 'user'}
                    onChange={(e) => onRoleChange(u.id, e.target.value)}
                    disabled={loading}
                    aria-label={`Cambiar rol de ${u.username}`}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <span
                    className={u.banned_at ? styles.badgeBanned : styles.badgeActive}
                  >
                    {u.banned_at ? 'Baneado' : 'Activo'}
                  </span>
                </td>
                <td className={styles.actions}>
                  {u.banned_at ? (
                    <button
                      className={styles.btnUnban}
                      onClick={() => onUnban(u.id)}
                      disabled={loading}
                    >
                      Desbanear
                    </button>
                  ) : (
                    <button
                      className={styles.btnBan}
                      onClick={() => onBan(u.id)}
                      disabled={loading}
                    >
                      Banear
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
