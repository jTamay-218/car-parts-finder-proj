import { createContext, useContext, useState, useEffect } from 'react';

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
  const [loading, setLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is logged in (from localStorage or API)
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      console.log('🔐 Attempting login to:', `${API_BASE_URL}/api/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      console.log('📡 Response status:', response.status, response.statusText);

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('❌ Server did not return JSON. Content-Type:', contentType);
        throw new Error('Backend server is not responding correctly. Make sure the backend is running on port 3001.');
      }

      const data = await response.json();
      console.log('📦 Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const userData = {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.first_name,
        lastName: data.user.last_name,
        username: data.user.username,
        role: data.user.role,
        admin: data.user.admin,
        token: data.token
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      return { success: true, user: userData, token: data.token };
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Better error messages
      let errorMessage = error.message;
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Cannot connect to backend server. Please make sure:\n1. Backend is running (npm start in backend folder)\n2. Backend is on port 3001\n3. Check frontend/.env has VITE_API_URL=http://localhost:3001';
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Backend server error. Please check:\n1. Backend terminal for errors\n2. Backend is running properly\n3. Database connection is working';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isSeller = () => {
    return user && (user.role === 'seller' || user.role === 'admin' || user.admin);
  };

  const isBuyer = () => {
    return user && (user.role === 'buyer' || user.role === 'admin' || user.admin);
  };

  const isLoggedIn = () => {
    return user !== null;
  };

  const isAdmin = () => {
    return user && (user.role === 'admin' || user.admin === true);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isSeller,
    isBuyer,
    isAdmin,
    isLoggedIn
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};



