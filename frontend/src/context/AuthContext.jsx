import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/apiServices';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('semp_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('semp_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem('semp_token');
      localStorage.removeItem('semp_user');
      setUser(null);
      setToken(null);
    };

    window.addEventListener('semp_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('semp_unauthorized', handleUnauthorized);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      const data = response.data;
      
      localStorage.setItem('semp_token', data.accessToken);
      localStorage.setItem('semp_user', JSON.stringify(data));
      
      setToken(data.accessToken);
      setUser(data);
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const response = await authApi.register(data);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('semp_token');
    localStorage.removeItem('semp_user');
    setUser(null);
    setToken(null);
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isEmployee = user?.role === 'ROLE_EMPLOYEE';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin, isEmployee }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
