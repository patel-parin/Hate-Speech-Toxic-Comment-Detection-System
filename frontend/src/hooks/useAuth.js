import { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      // Login request with credentials
      await axios.post(
        'https://hate-speech-toxic-comment-detection.vercel.app/api/auth/login',
        { email, password },
        { withCredentials: true } // ✅ important for cookies
      );

      // Fetch authenticated user
      const res = await axios.get(
        'https://hate-speech-toxic-comment-detection.vercel.app/api/auth/me',
        { withCredentials: true } // ✅ include cookie
      );

      setUser(res.data); // store user in context
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Login failed',
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        'https://hate-speech-toxic-comment-detection.vercel.app/api/auth/logout',
        {},
        { withCredentials: true }
      );
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
