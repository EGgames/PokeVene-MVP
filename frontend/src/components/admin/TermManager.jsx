import { useState } from 'react';
import styles from './TermManager.module.css';

export default function TermManager({ onAdd, onDelete, loading }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('pokemon');
  const [localError, setLocalError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  async function handleAdd(e) {
    e.preventDefault();
    setLocalError(null);
    setSuccessMsg(null);
    if (!text.trim()) {
      setLocalError('El texto del término es requerido.');
      return;
    }
    try {
      await onAdd({ text: text.trim(), category });
      setSuccessMsg(`Término "${text.trim()}" agregado.`);
      setText('');
      setCategory('pokemon');
    } catch (err) {
      setLocalError(err.message);
    }
  }

  return (
    <div data-testid="term-manager" className={styles.wrapper}>
      <h3 className={styles.title}>Agregar Término</h3>

      {localError && <p className={styles.error}>{localError}</p>}
      {successMsg && <p className={styles.success}>{successMsg}</p>}

      <form className={styles.form} onSubmit={handleAdd}>
        <input
          data-testid="term-text"
          type="text"
          className={styles.input}
          placeholder="Nombre del término"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          maxLength={100}
        />
        <select
          data-testid="term-category"
          className={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={loading}
        >
          <option value="pokemon">Pokémon</option>
          <option value="venezolano">Venezolano</option>
        </select>
        <button
          data-testid="term-add-btn"
          type="submit"
          className={styles.button}
          disabled={loading}
        >
          {loading ? 'Guardando…' : 'Agregar'}
        </button>
      </form>
    </div>
  );
}
