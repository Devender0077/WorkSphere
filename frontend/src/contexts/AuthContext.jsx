import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({ user: null, login: () => {}, logout: () => {} });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hrd-user') || 'null'); } catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem('hrd-user', JSON.stringify(user));
    else localStorage.removeItem('hrd-user');
  }, [user]);

  const login = (email) => {
    setUser({
      name: 'Pristia Candra',
      firstName: 'Pristia',
      email: email || 'lincoln@unpixel.com',
      role: '3D Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    });
  };
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
