import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI, setToken, getToken, deleteToken } from '../services/api';
import type { User, LoginCredentials, RegisterData, AuthResult } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (userData: RegisterData) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<void> => {
    if (getToken()) {
      try {
        const response = await authAPI.getMe();
        setUser(response.data);
      } catch (error) {
        deleteToken();
      }
    }
    setLoading(false);
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      const response = await authAPI.login(credentials);
      setToken(response.data.access_token);
      await checkAuth();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Erreur' };
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResult> => {
    try {
      await authAPI.register(userData);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.detail || 'Erreur' };
    }
  };

  const logout = (): void => {
    deleteToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};