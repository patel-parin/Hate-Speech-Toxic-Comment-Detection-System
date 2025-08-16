import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
  let isMounted = true;

  const checkAuth = async () => {
    try {
      const { data } = await api.get('/auth/me', { withCredentials: true });
      if (isMounted) {
        setUser(data.user);
        setIsAuthenticated(true);
      }
    } catch {
      if (isMounted) {
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  checkAuth();
  return () => { isMounted = false; };
}, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      await api.post('/auth/login', { email, password }, { withCredentials: true });
      // Now fetch the user profile
      const { data } = await api.get('/auth/me', { withCredentials: true });
      setUser(data.user);
      setIsAuthenticated(true);
      toast.success('Login successful!');
      return { success: true };
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

   const register = async (username, email, password) => {
    try {
      // The register request creates the user AND sets the login cookie
      await api.post('/auth/register', { username, email, password });
      // Now fetch the new user's profile to update the context state
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      setIsAuthenticated(true);
      toast.success('Registration successful!');
      return { success: true };
    } catch (err) {
      const message = err?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    }
  };


  const logout = async () => {
    await api.post('/auth/logout', {}, { withCredentials: true });
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, register , logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };