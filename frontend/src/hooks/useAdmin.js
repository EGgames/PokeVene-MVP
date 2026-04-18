import { useCallback, useState } from 'react';
import {
  getUsers,
  updateUserRole,
  banUser as banUserService,
  unbanUser as unbanUserService,
  getSuggestions,
  reviewSuggestion as reviewSuggestionService,
  getSettings as getSettingsService,
  updateSettings as updateSettingsService,
  addTerm as addTermService,
  deleteTerm as deleteTermService,
} from '../services/adminService';
import { useAuth } from './useAuth';

export function useAdmin() {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [totalSuggestions, setTotalSuggestions] = useState(0);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUsers(token, params);
        setUsers(data.users ?? data);
        setTotalUsers(data.total ?? (data.users ?? data).length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const banUser = useCallback(
    async (id) => {
      setError(null);
      try {
        await banUserService(id, token);
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, banned_at: new Date().toISOString() } : u))
        );
      } catch (err) {
        setError(err.message);
      }
    },
    [token]
  );

  const unbanUser = useCallback(
    async (id) => {
      setError(null);
      try {
        await unbanUserService(id, token);
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, banned_at: null } : u))
        );
      } catch (err) {
        setError(err.message);
      }
    },
    [token]
  );

  const updateRole = useCallback(
    async (id, role) => {
      setError(null);
      try {
        const updated = await updateUserRole(id, role, token);
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, role: updated.role ?? role } : u))
        );
      } catch (err) {
        setError(err.message);
      }
    },
    [token]
  );

  const fetchSuggestions = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSuggestions(token, params);
        setSuggestions(data.suggestions ?? data);
        setTotalSuggestions(data.total ?? (data.suggestions ?? data).length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const reviewSuggestion = useCallback(
    async (id, data) => {
      setError(null);
      try {
        await reviewSuggestionService(id, data, token);
        setSuggestions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: data.status } : s))
        );
      } catch (err) {
        setError(err.message);
      }
    },
    [token]
  );

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSettingsService(token);
      setSettings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateSettings = useCallback(
    async (data) => {
      setError(null);
      try {
        const updated = await updateSettingsService(data, token);
        setSettings(updated);
        return updated;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [token]
  );

  const addTerm = useCallback(
    async (data) => {
      setError(null);
      try {
        return await addTermService(data, token);
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [token]
  );

  const deleteTerm = useCallback(
    async (id) => {
      setError(null);
      try {
        return await deleteTermService(id, token);
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [token]
  );

  return {
    users,
    totalUsers,
    suggestions,
    totalSuggestions,
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
    deleteTerm,
  };
}
