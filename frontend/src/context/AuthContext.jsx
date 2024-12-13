import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    loading: true
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authService.verifyToken();
          if (response.status === 'success' && response.data) {
            setAuth({
              isAuthenticated: true,
              user: response.data,
              loading: false
            });
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setAuth({
              isAuthenticated: false,
              user: null,
              loading: false
            });
          }
        } catch (error) {
          console.error('Error al verificar el token:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuth({
            isAuthenticated: false,
            user: null,
            loading: false
          });
        }
      } else {
        setAuth(prev => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();
  }, []);

  const updateUser = (userData) => {
    if (!userData) return;

    setAuth(prev => ({
      ...prev,
      user: {
        ...prev.user,
        ...userData
      }
    }));
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.token && response.user) {
        setAuth({
          isAuthenticated: true,
          user: response.user,
          loading: false
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setAuth({
      isAuthenticated: false,
      user: null,
      loading: false
    });
  };

  const register = async (userData) => {
    try {
      const user = await authService.register(userData);
      return user;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        auth, 
        updateUser,
        login,
        logout,
        register
      }}
    >
      {!auth.loading && children}
    </AuthContext.Provider>
  );
};