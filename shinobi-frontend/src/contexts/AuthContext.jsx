import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const authStatus = localStorage.getItem('shinobi-admin-auth');
        if (authStatus) {
          const { isAuthenticated: auth, timestamp } = JSON.parse(authStatus);
          // Check if the session is still valid (24 hours)
          const now = Date.now();
          const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
          
          if (auth && (now - timestamp) < sessionDuration) {
            setIsAuthenticated(true);
          } else {
            // Session expired, clear it
            localStorage.removeItem('shinobi-admin-auth');
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    const authData = {
      isAuthenticated: true,
      timestamp: Date.now()
    };
    localStorage.setItem('shinobi-admin-auth', JSON.stringify(authData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('shinobi-admin-auth');
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
