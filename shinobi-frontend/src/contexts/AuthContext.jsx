import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authAPI.getAuthToken();
        const storedUser = authAPI.getStoredUser();

        if (token && storedUser) {
          // Verify token is still valid by making a request
          try {
            const response = await authAPI.getCurrentUser();
            setUser(response.user);
            setIsAuthenticated(true);
          } catch (error) {
            console.warn('Token verification failed:', error);
            // Token is invalid, clear auth
            authAPI.clearAuth();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(username, password);
      
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, user: response.user };
      } else {
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await authAPI.logout();
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authAPI.changePassword(currentPassword, newPassword);
      return { success: true, message: response.message };
    } catch (error) {
      console.error('Change password error:', error);
      return { 
        success: false, 
        message: error.message || 'Password change failed' 
      };
    }
  };

  // Check if user has admin role
  const isAdmin = () => {
    return user && (user.role === 'admin' || user.role === 'super-admin');
  };

  // Check if user has super admin role
  const isSuperAdmin = () => {
    return user && user.role === 'super-admin';
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    changePassword,
    isAdmin,
    isSuperAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;