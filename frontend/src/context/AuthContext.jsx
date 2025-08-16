// import React, { createContext, useContext, useState, useEffect } from 'react';
// import toast from 'react-hot-toast';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     // Check for existing session
//     const token = localStorage.getItem('authToken');
//     const userData = localStorage.getItem('userData');
    
//     if (token && userData) {
//       try {
//         const parsedUser = JSON.parse(userData);
//         setUser(parsedUser);
//         setIsAuthenticated(true);
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userData');
//       }
//     }
    
//     setIsLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     try {
//       setIsLoading(true);
      
//       // For development, use mock authentication
//       if (process.env.NODE_ENV === 'development') {
//         await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
//         const mockUser = {
//           id: '1',
//           name: 'John Doe',
//           email: email,
//           avatar: 'JD',
//           role: 'user',
//           apiKey: 'sk-1234567890abcdef',
//           joinedAt: new Date().toISOString(),
//           settings: {
//             notifications: true,
//             theme: 'light',
//             toxicityThreshold: 0.7
//           }
//         };

//         const mockToken = 'mock-jwt-token-' + Date.now();
        
//         localStorage.setItem('authToken', mockToken);
//         localStorage.setItem('userData', JSON.stringify(mockUser));
        
//         setUser(mockUser);
//         setIsAuthenticated(true);
        
//         toast.success('Login successful!');
//         return mockUser;
//       }

//       // Production API call would go here
//       // const response = await api.post('/auth/login', { email, password });
//       // const { user, token } = response.data;
//       // localStorage.setItem('authToken', token);
//       // localStorage.setItem('userData', JSON.stringify(user));
//       // setUser(user);
//       // setIsAuthenticated(true);
//       // return user;
      
//     } catch (error) {
//       toast.error('Login failed. Please check your credentials.');
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const register = async (name, email, password) => {
//     try {
//       setIsLoading(true);
      
//       // For development, use mock registration
//       if (process.env.NODE_ENV === 'development') {
//         await new Promise(resolve => setTimeout(resolve, 1500));
        
//         const mockUser = {
//           id: Date.now().toString(),
//           name,
//           email,
//           avatar: name.split(' ').map(n => n[0]).join(''),
//           role: 'user',
//           apiKey: 'sk-' + Math.random().toString(36).substr(2, 16),
//           joinedAt: new Date().toISOString(),
//           settings: {
//             notifications: true,
//             theme: 'light',
//             toxicityThreshold: 0.7
//           }
//         };

//         const mockToken = 'mock-jwt-token-' + Date.now();
        
//         localStorage.setItem('authToken', mockToken);
//         localStorage.setItem('userData', JSON.stringify(mockUser));
        
//         setUser(mockUser);
//         setIsAuthenticated(true);
        
//         toast.success('Registration successful!');
//         return mockUser;
//       }

//       // Production API call would go here
      
//     } catch (error) {
//       toast.error('Registration failed. Please try again.');
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userData');
//     setUser(null);
//     setIsAuthenticated(false);
//     toast.success('Logged out successfully');
//   };

//   const updateUser = (updatedData) => {
//     const updatedUser = { ...user, ...updatedData };
//     setUser(updatedUser);
//     localStorage.setItem('userData', JSON.stringify(updatedUser));
//     toast.success('Profile updated successfully');
//   };

//   const value = {
//     user,
//     isLoading,
//     isAuthenticated,
//     login,
//     register,
//     logout,
//     updateUser
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export { AuthContext };


// src/context/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import api from '../services/api'; // <-- ensure this path is correct for your project

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     const userData = localStorage.getItem('userData');

//     if (token && userData) {
//       try {
//         const parsedUser = JSON.parse(userData);
//         setUser(parsedUser);
//         setIsAuthenticated(true);
//       } catch {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userData');
//       }
//     }

//     setIsLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     setIsLoading(true);
//     try {
//       const { data } = await api.post('/auth/login', { email, password });
//       // Expecting backend to return: { user, token }
//       const { user, token } = data;

//       localStorage.setItem('authToken', token);
//       localStorage.setItem('userData', JSON.stringify(user));
//       setUser(user);
//       setIsAuthenticated(true);
//       toast.success('Login successful!');
//       return { success: true, user };
//     } catch (error) {
//       const msg = error?.response?.data?.message || 'Login failed. Please check your credentials.';
//       toast.error(msg);
//       return { success: false, error: msg };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const register = async (username, email, password) => {
//     setIsLoading(true);
//     try {
//       const { data } = await api.post('/auth/register', { username, email, password });
//       // Expecting backend to return: { user, token }
//       const { user, token } = data;

//       localStorage.setItem('authToken', token);
//       localStorage.setItem('userData', JSON.stringify(user));
//       setUser(user);
//       setIsAuthenticated(true);
//       toast.success('Registration successful!');
//       return { success: true, user };
//     } catch (error) {
//       const msg = error?.response?.data?.message || 'Registration failed. Please try again.';
//       toast.error(msg);
//       return { success: false, error: msg };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userData');
//     setUser(null);
//     setIsAuthenticated(false);
//     toast.success('Logged out successfully');
//   };

//   const updateUser = (updatedData) => {
//     const updatedUser = { ...user, ...updatedData };
//     setUser(updatedUser);
//     localStorage.setItem('userData', JSON.stringify(updatedUser));
//     toast.success('Profile updated successfully');
//   };

//   const value = {
//     user,
//     isLoading,
//     isAuthenticated,
//     login,
//     register,
//     logout,
//     updateUser,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export { AuthContext };


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

  const logout = async () => {
    await api.post('/auth/logout', {}, { withCredentials: true });
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };