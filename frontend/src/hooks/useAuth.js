import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  loginUser,
  logoutUser,
  registerUser,
  validateToken,
} from '../services/authService';

const AuthContext = createContext(null);

/**
 * Proveedor del contexto de autenticación.
 * Envuelve la aplicación para exponer el estado de auth globalmente.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al montar: recuperar y validar token persistido
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    validateToken(storedToken)
      .then((userData) => {
        setToken(storedToken);
        setUser(userData);
      })
      .catch(() => {
        // Token inválido o expirado → limpiar
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  /**
   * Inicia sesión con username y password.
   * @param {string} username
   * @param {string} password
   */
  const login = useCallback(async (username, password) => {
    const data = await loginUser(username, password);
    const { token: newToken, id, username: returnedUsername, created_at } = data;

    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify({ id, username: returnedUsername, created_at }));

    setToken(newToken);
    setUser({ id, username: returnedUsername, created_at });
  }, []);

  /**
   * Registra un nuevo usuario e inicia sesión directamente.
   * @param {string} username
   * @param {string} password
   */
  const register = useCallback(async (username, password) => {
    const data = await registerUser(username, password);
    const { token: newToken, id, username: returnedUsername, created_at } = data;

    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify({ id, username: returnedUsername, created_at }));

    setToken(newToken);
    setUser({ id, username: returnedUsername, created_at });
  }, []);

  /**
   * Cierra sesión y limpia el estado local.
   */
  const logout = useCallback(() => {
    logoutUser();
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

/**
 * Hook para consumir el contexto de autenticación.
 * Debe usarse dentro de un AuthProvider.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>');
  }
  return ctx;
}
