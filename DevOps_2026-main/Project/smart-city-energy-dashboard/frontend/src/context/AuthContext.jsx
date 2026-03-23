import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import api from '../services/api';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('smartcity_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('smartcity_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('smartcity_token', token);
    } else {
      localStorage.removeItem('smartcity_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('smartcity_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smartcity_user');
    }
  }, [user]);

  const authAction = async (endpoint, payload) => {
    setLoading(true);
    try {
      const response = await api.post(endpoint, payload);
      setUser(response.data.data.user);
      setToken(response.data.data.token);
      return response.data.data.user;
    } finally {
      setLoading(false);
    }
  };

  const login = (payload) => authAction('/auth/login', payload);
  const register = (payload) => authAction('/auth/register', payload);

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const refreshProfile = async () => {
    if (!token) {
      return null;
    }

    const response = await api.get('/auth/me');
    setUser(response.data.data);
    return response.data.data;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      refreshProfile,
    }),
    [loading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

export { AuthProvider, useAuth };
