import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  can: () => false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hrd-user') || 'null'); } catch { return null; }
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('hrd-token')));

  useEffect(() => {
    const token = localStorage.getItem('hrd-token');
    if (!token) { setLoading(false); return; }
    (async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
        localStorage.setItem('hrd-user', JSON.stringify(data));
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('hrd-token', data.token);
    localStorage.setItem('hrd-user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('hrd-token');
    localStorage.removeItem('hrd-user');
    setUser(null);
  };

  const can = (perm) => !!user?.permissions?.includes(perm);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
