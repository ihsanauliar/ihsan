import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, ServiceItem } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  token: string | null;
  user: User | null;
  balance: number;
  showBalance: boolean;
  isLoading: boolean;
  activeTab: string;
  selectedService: ServiceItem | null;
  toggleBalance: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (payload: { email: string; first_name: string; last_name: string; password: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshBalance: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (firstName: string, lastName: string) => Promise<{ success: boolean; message: string }>;
  updateAvatar: (file: File) => Promise<{ success: boolean; message: string }>;
  setActiveTab: (tab: string) => void;
  setSelectedService: (service: ServiceItem | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => apiService.getToken());
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [showBalance, setShowBalance] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const toggleBalance = () => {
    setShowBalance((prev) => !prev);
  };

  const refreshBalance = async () => {
    try {
      const res = await apiService.getBalance();
      if (res.data) {
        setBalance(res.data.balance);
      }
    } catch (e) {
      console.error('Failed to get balance:', e);
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await apiService.getProfile();
      if (res.data) {
        setUser(res.data);
      }
    } catch (e) {
      console.error('Failed to get profile:', e);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      if (token) {
        await Promise.all([refreshProfile(), refreshBalance()]);
      }
      setIsLoading(false);
    };
    init();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await apiService.login({ email, password });
      if (res.status === 0 && res.data?.token) {
        setToken(res.data.token);
        await Promise.all([refreshProfile(), refreshBalance()]);
        return { success: true, message: res.message || 'Login Sukses' };
      }
      return { success: false, message: res.message || 'Login gagal' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Terjadi kesalahan sistem' };
    }
  };

  const register = async (payload: { email: string; first_name: string; last_name: string; password: string }) => {
    try {
      const res = await apiService.register(payload);
      if (res.status === 0) {
        return { success: true, message: res.message || 'Registrasi berhasil' };
      }
      return { success: false, message: res.message || 'Registrasi gagal' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Terjadi kesalahan sistem' };
    }
  };

  const logout = () => {
    apiService.clearToken();
    setToken(null);
    setUser(null);
    setBalance(0);
    setActiveTab('home');
  };

  const updateProfile = async (first_name: string, last_name: string) => {
    try {
      const res = await apiService.updateProfile({ first_name, last_name });
      if (res.status === 0 && res.data) {
        setUser(res.data);
        return { success: true, message: 'Update Profile berhasil' };
      }
      return { success: false, message: res.message || 'Update gagal' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Terjadi kesalahan' };
    }
  };

  const updateAvatar = async (file: File) => {
    try {
      // Validate file size max 100kb
      if (file.size > 100 * 1024) {
        return { success: false, message: 'Ukuran file gambar maksimal 100 KB' };
      }
      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        return { success: false, message: 'Format gambar hanya boleh jpeg atau png' };
      }

      const res = await apiService.updateProfileImage(file);
      if (res.status === 0 && res.data) {
        setUser(res.data);
        return { success: true, message: 'Update Profile Image berhasil' };
      }
      return { success: false, message: res.message || 'Update foto gagal' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Terjadi kesalahan' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        balance,
        showBalance,
        isLoading,
        activeTab,
        selectedService,
        toggleBalance,
        login,
        register,
        logout,
        refreshBalance,
        refreshProfile,
        updateProfile,
        updateAvatar,
        setActiveTab,
        setSelectedService,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
