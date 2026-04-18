import { useState } from 'react';
import styles from './SuggestionForm.module.css';

export default function SuggestionForm({ onSubmit, isLoading }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('pokemon');
  const [localError, setLocalError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null);
    if (!text.trim()) {
      setLocalError('El texto es requerido.');
      return;
    }
    try {
      await onSubmit({ text: text.trim(), category });
      setText('');
      setCategory('pokemon');
    } catch (err) {
      setLocalError(err.message);
    }
  }

  return (
    <form
      data-testid="suggestion-form"
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <h3 className={styles.title}>Sugerir Término</h3>

      {localError && <p className={styles.error}>{localError}</p>}

      <div className={styles.field}>
        <label htmlFor="suggestion-text" className={styles.label}>
          Término
        </label>
        <input
          id="suggestion-text"
          data-testid="suggestion-text"
          type="text"
          className={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nombre del Pokémon o término venezolano"
          disabled={isLoading}
          maxLength={100}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="suggestion-category" className={styles.label}>
          Categoría
        </label>
        <select
          id="suggestion-category"
          data-testid="suggestion-category"
          className={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={isLoading}
        >
          <option value="pokemon">Pokémon</option>
          <option value="venezolano">Venezolano</option>
        </select>
      </div>

      <button
        data-testid="suggestion-submit"
        type="submit"
        className={styles.button}
        disabled={isLoading}
      >
        {isLoading ? 'Enviando…' : 'Enviar Sugerencia'}
      </button>
    </form>
  );
}
