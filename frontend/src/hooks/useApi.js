import { useState, useCallback } from 'react';
import axios from 'axios';

const useApi = (baseURL = 'https://hate-speech-toxic-comment-detection.vercel.app/api') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (endpoint, options = {}) => {
    try {
      setLoading(true);
      setError(null);

      const config = {
        url: `${baseURL}${endpoint}`,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        withCredentials: true, // ✅ send cookies cross-origin
        ...options
      };

      // Optional: add JWT token from localStorage
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios(config);
      return { data: response.data, error: null };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [baseURL]);

  return {
    loading,
    error,
    request,
    get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
    post: (endpoint, data, options) => request(endpoint, { method: 'POST', data, ...options }),
    put: (endpoint, data, options) => request(endpoint, { method: 'PUT', data, ...options }),
    delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
  };
};

export default useApi;
