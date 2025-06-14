import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useToast } from './ToastContext';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const parseJwt = (token: string): { exp?: number } | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const notifyTimes = [
  { ms: 60 * 60 * 1000, msg: 'До окончания сессии остался 1 час.' },
  { ms: 30 * 60 * 1000, msg: 'До окончания сессии осталось 30 минут.' },
  { ms: 15 * 60 * 1000, msg: 'До окончания сессии осталось 15 минут.' },
  { ms: 5 * 60 * 1000, msg: 'До окончания сессии осталось 5 минут.' },
  { ms: 1 * 60 * 1000, msg: 'До окончания сессии осталась 1 минута.' },
  { ms: 30 * 1000, msg: 'До окончания сессии осталось 30 секунд.' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    clearTimers();
    showToast('Сессия завершена. Пожалуйста, войдите снова.', 'info');
  };

  const scheduleNotificationsAndLogout = (token: string) => {
    clearTimers();
    const payload = parseJwt(token);
    if (!payload?.exp) return;

    const timeLeft = payload.exp * 1000 - Date.now();
    if (timeLeft <= 0) return logout();

    notifyTimes.forEach(({ ms, msg }) => {
      const delay = timeLeft - ms;
      if (delay > 0) {
        timers.current.push(setTimeout(() => showToast(msg, 'info'), delay));
      }
    });

    timers.current.push(setTimeout(logout, timeLeft));
  };

  const validateToken = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      clearTimers();
      return;
    }
    try {
      const res = await fetch('http://127.0.0.1:1111/auth/validate_access_token', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setIsAuthenticated(true);
        scheduleNotificationsAndLogout(token);
      } else {
        setIsAuthenticated(false);
        clearTimers();
      }
    } catch {
      setIsAuthenticated(false);
      clearTimers();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:1111/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('Неверный логин или пароль');
      const data = await res.json();
      localStorage.setItem('access_token', data.access_token);
      setIsAuthenticated(true);
      scheduleNotificationsAndLogout(data.access_token);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateToken();
    return clearTimers;
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
