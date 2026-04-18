import { useCallback, useEffect, useState } from 'react';
import { getSuggestionThreshold } from '../services/suggestionService';
import { useAuth } from './useAuth';

export function useDashboard() {
  const { user, token, refreshUser } = useAuth();
  const [threshold, setThreshold] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchThreshold = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getSuggestionThreshold(token);
      setThreshold(data.suggestion_level_threshold ?? 10);
    } catch {
      // non-critical; use default
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchThreshold().finally(() => setLoading(false));
  }, [token, fetchThreshold]);

  const canSuggest = user ? (user.level ?? 1) >= threshold : false;

  return {
    user,
    canSuggest,
    suggestionThreshold: threshold,
    loading,
    error,
    refreshUser,
  };
}
