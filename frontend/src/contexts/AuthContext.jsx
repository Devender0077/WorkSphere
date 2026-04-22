import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';

const AuthContext = createContext({
  user: null,
  loading: true,
  branding: null,
  impersonation: null,
  login: async () => {},
  logout: () => {},
  can: () => false,
  startImpersonation: async () => {},
  stopImpersonation: () => {},
  refreshBranding: async () => {},
});

const readJSON = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readJSON('hrd-user'));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('hrd-token')));
  const [branding, setBranding] = useState(() => readJSON('hrd-branding'));
  const [impersonation, setImpersonation] = useState(() => readJSON('hrd-impersonation'));

  const refreshBranding = useCallback(async () => {
    try {
      const { data } = await api.get('/tenant/branding');
      setBranding(data);
      localStorage.setItem('hrd-branding', JSON.stringify(data));
      return data;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('hrd-token');
    if (!token) { setLoading(false); return; }
    (async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
        localStorage.setItem('hrd-user', JSON.stringify(data));
        if (data.tenant_id) await refreshBranding();
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshBranding]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('hrd-token', data.token);
    localStorage.setItem('hrd-user', JSON.stringify(data.user));
    setUser(data.user);
    if (data.user.tenant_id) await refreshBranding();
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('hrd-token');
    localStorage.removeItem('hrd-user');
    localStorage.removeItem('hrd-branding');
    localStorage.removeItem('hrd-impersonation');
    setUser(null); setBranding(null); setImpersonation(null);
  };

  const startImpersonation = async (userId) => {
    // Save current superadmin session so we can restore it
    const currentToken = localStorage.getItem('hrd-token');
    const currentUser = readJSON('hrd-user');
    const { data } = await api.post(`/platform/impersonate/${userId}`);
    localStorage.setItem('hrd-token', data.token);
    localStorage.setItem('hrd-user', JSON.stringify(data.user));
    const imp = { original_token: currentToken, original_user: currentUser, impersonating: data.user };
    localStorage.setItem('hrd-impersonation', JSON.stringify(imp));
    setUser(data.user);
    setImpersonation(imp);
    if (data.user.tenant_id) await refreshBranding();
    return data.user;
  };

  const stopImpersonation = () => {
    const imp = readJSON('hrd-impersonation');
    if (!imp) return;
    localStorage.setItem('hrd-token', imp.original_token);
    localStorage.setItem('hrd-user', JSON.stringify(imp.original_user));
    localStorage.removeItem('hrd-impersonation');
    localStorage.removeItem('hrd-branding');
    setUser(imp.original_user);
    setImpersonation(null);
    setBranding(null);
  };

  const can = (perm) => !!user?.permissions?.includes(perm);

  return (
    <AuthContext.Provider value={{ user, loading, branding, impersonation, login, logout, can, startImpersonation, stopImpersonation, refreshBranding }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
