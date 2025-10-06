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

  const login = async (email, password, userType = 'buyer') => {
    try {
      // Simulate API call - in real app, this would call your backend
      const mockUser = {
        id: '1',
        email: email,
        name: email.split('@')[0],
        type: userType, // 'buyer' or 'seller'
        avatar: '👤',
        joinedDate: new Date().toISOString()
      };

      // Simulate different response based on credentials
      if (email === 'seller@example.com' && password === 'seller123') {
        mockUser.type = 'seller';
        mockUser.name = 'John Seller';
        mockUser.avatar = '👨‍💼';
      } else if (email === 'buyer@example.com' && password === 'buyer123') {
        mockUser.type = 'buyer';
        mockUser.name = 'Jane Buyer';
        mockUser.avatar = '👩‍🛒';
      } else if (email === 'admin@example.com' && password === 'admin123') {
        mockUser.type = 'admin';
        mockUser.name = 'Admin User';
        mockUser.avatar = '👨‍💻';
      } else {
        throw new Error('Invalid credentials');
      }

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isSeller = () => {
    return user && (user.type === 'seller' || user.type === 'admin');
  };

  const isBuyer = () => {
    return user && (user.type === 'buyer' || user.type === 'admin');
  };

  const isLoggedIn = () => {
    return user !== null;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isSeller,
    isBuyer,
    isLoggedIn
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
