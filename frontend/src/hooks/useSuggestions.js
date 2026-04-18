import { useCallback, useState } from 'react';
import { submitSuggestion, getMySuggestions } from '../services/suggestionService';
import { useAuth } from './useAuth';

export function useSuggestions() {
  const { token } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getMySuggestions(token);
      setSuggestions(data.suggestions ?? data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const submit = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);
      try {
        const result = await submitSuggestion(data, token);
        await refresh();
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, refresh]
  );

  return { suggestions, loading, error, submit, refresh };
}
