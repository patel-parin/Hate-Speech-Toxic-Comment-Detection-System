import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  // This is the crucial part. It tells axios to send cookies
  // with every request to the backend.
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json'
  }
});

// We no longer need the old interceptors that handled localStorage.
// The browser and our secure backend will now handle the session
// automatically via httpOnly cookies.

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: You can add logic here to redirect to login on 401,
    // but it's better handled within the AuthContext to avoid page reloads.
    // For now, we just let the error pass through to be caught by the component.
    return Promise.reject(error);
  }
);

export default api;
