import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true);
      console.log('Starting login process...');
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login API response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const userData = data.data.user;
      const tokenData = data.data.token;

      // Store in localStorage first
      localStorage.setItem('token', tokenData);
      localStorage.setItem('user', JSON.stringify(userData));

      // Then update state
      setToken(tokenData);
      setUser(userData);

      console.log('Login successful:', {
        token: tokenData,
        user: userData
      });

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!token && !!user;
  }, [token, user]);

  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 