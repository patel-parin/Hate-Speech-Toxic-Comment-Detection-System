import { createContext, useContext, useState } from 'react';
import useApi from './useApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { post, get } = useApi();

  const login = async (email, password) => {
    try {
      const { data, error } = await post('/auth/login', { email, password });
      if (error) return { success: false, error };

      const { data: me, error: meError } = await get('/auth/me');
      if (meError) return { success: false, error: meError };

      setUser(me);
      return { success: true, data: me };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await post('/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to access AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
