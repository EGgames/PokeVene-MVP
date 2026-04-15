import { useState, useEffect, useCallback } from 'react';
import { getLeaderboard } from '../services/gameService';

/**
 * Fetch y caché del leaderboard público.
 * @returns {{ scores: Array, loading: boolean, error: string|null, refresh: Function }}
 */
export function useLeaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeaderboard();
      setScores(data);
    } catch {
      setError('Error al cargar la tabla de posiciones.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { scores, loading, error, refresh: fetchLeaderboard };
}
