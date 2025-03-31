import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { toast } from 'sonner';

// Mock API functions - to be replaced with actual API calls
const mockLogin = async (email: string, password: string): Promise<User> => {
  // In a real app, this would be an API call to validate credentials
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate admin login
      if (email === 'admin@example.com' && password === 'Admin@123') {
        resolve({
          id: '1',
          name: 'System Administrator',
          email: 'admin@example.com',
          address: '123 Admin St, City',
          role: 'ADMIN'
        });
      } 
      // Simulate store owner login
      else if (email === 'store@example.com' && password === 'Store@123') {
        resolve({
          id: '2',
          name: 'Store Owner',
          email: 'store@example.com',
          address: '456 Store Ave, City',
          role: 'STORE_OWNER'
        });
      } 
      // Simulate normal user login
      else if (email === 'user@example.com' && password === 'User@123') {
        resolve({
          id: '3',
          name: 'Normal User',
          email: 'user@example.com',
          address: '789 User Blvd, City',
          role: 'USER'
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
};

const mockRegister = async (name: string, email: string, password: string, address: string): Promise<User> => {
  // In a real app, this would be an API call to register a user
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if email already exists (in a real app, this would be handled by the backend)
      if (['admin@example.com', 'store@example.com', 'user@example.com'].includes(email)) {
        reject(new Error('Email already registered'));
        return;
      }
      
      resolve({
        id: (Math.floor(Math.random() * 1000) + 10).toString(),
        name,
        email,
        address,
        role: 'USER'
      });
    }, 500);
  });
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's a user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const user = await mockLogin(email, password);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success(`Welcome back, ${user.name}!`);
    } catch (error) {
      toast.error('Invalid email or password');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, address: string) => {
    try {
      setIsLoading(true);
      const user = await mockRegister(name, email, password, address);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Registration successful!');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
