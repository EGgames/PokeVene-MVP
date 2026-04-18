import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTable from '../components/admin/UserTable';
import TermManager from '../components/admin/TermManager';
import SuggestionReview from '../components/admin/SuggestionReview';
import { useAdmin } from '../hooks/useAdmin';
import styles from './AdminPage.module.css';

const TABS = [
  { key: 'users', label: 'Usuarios' },
  { key: 'terms', label: 'Términos' },
  { key: 'suggestions', label: 'Sugerencias' },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [threshold, setThreshold] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const {
    users,
    suggestions,
    settings,
    loading,
    error,
    fetchUsers,
    banUser,
    unbanUser,
    updateRole,
    fetchSuggestions,
    reviewSuggestion,
    fetchSettings,
    updateSettings,
    addTerm,
  } = useAdmin();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (activeTab === 'suggestions') fetchSuggestions();
  }, [activeTab, fetchSuggestions]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings?.suggestion_level_threshold != null) {
      setThreshold(String(settings.suggestion_level_threshold));
    }
  }, [settings]);

  async function handleSaveSettings(e) {
    e.preventDefault();
    setSettingsSaved(false);
    const parsed = parseInt(threshold, 10);
    if (isNaN(parsed) || parsed < 1) return;
    await updateSettings({ suggestion_level_threshold: parsed });
    setSettingsSaved(true);
  }

  return (
    <div data-testid="admin-page" className={styles.page}>
      <header className={styles.header}>
        <span
          className={styles.brand}
          role="button"
          tabIndex={0}
          onClick={() => navigate('/')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
        >
          PokeVene
        </span>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate('/dashboard')}
        >
          ← Dashboard
        </button>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Panel de Administración</h1>

        {error && <p className={styles.error}>{error}</p>}

        <nav className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.key}
              data-testid={`admin-tab-${t.key}`}
              type="button"
              className={activeTab === t.key ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <section className={styles.section}>
          {activeTab === 'users' && (
            <UserTable
              users={users}
              onBan={banUser}
              onUnban={unbanUser}
              onRoleChange={updateRole}
              loading={loading}
            />
          )}

          {activeTab === 'terms' && (
            <TermManager
              onAdd={addTerm}
              onDelete={() => {}}
              loading={loading}
            />
          )}

          {activeTab === 'suggestions' && (
            <SuggestionReview
              suggestions={suggestions}
              onApprove={(id) => reviewSuggestion(id, { status: 'approved' })}
              onReject={(id) => reviewSuggestion(id, { status: 'rejected' })}
              loading={loading}
            />
          )}
        </section>

        <section className={styles.settingsSection}>
          <h2 className={styles.settingsTitle}>Configuración</h2>
          <form className={styles.settingsForm} onSubmit={handleSaveSettings}>
            <label htmlFor="threshold" className={styles.settingsLabel}>
              Nivel mínimo para sugerir términos
            </label>
            <div className={styles.settingsRow}>
              <input
                id="threshold"
                type="number"
                min={1}
                className={styles.settingsInput}
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className={styles.settingsButton}
                disabled={loading}
              >
                Guardar
              </button>
            </div>
            {settingsSaved && (
              <p className={styles.settingsSuccess}>Configuración guardada.</p>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}
