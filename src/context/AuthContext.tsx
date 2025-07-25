import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { apiService } from '../services/api';

export type ViewType = 'home' | 'rsvp' | 'schedule' | 'events' | 'location' | 'guests' | 'profile';

interface AuthContextType extends AuthState {
  login: (identifier: string) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (otp: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  pendingUser: User | null;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  showOTP: boolean;
  setShowOTP: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [showOTP, setShowOTP] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');
    
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        apiService.setToken(token);
        setState({
          isAuthenticated: true,
          user,
          loading: false,
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        setState(prev => ({ ...prev, loading: false }));
      }
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (identifier: string): Promise<{ success: boolean; message: string }> => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await apiService.login(identifier);
      setPendingUserId(response.userId);
      setState(prev => ({ ...prev, loading: false }));
      setShowOTP(true);
      return { success: true, message: response.message };
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      return { success: false, message: error instanceof Error ? error.message : 'Connection error. Please try again.' };
    }
  };

  const verifyOTP = async (otp: string): Promise<{ success: boolean; message: string }> => {
    setState(prev => ({ ...prev, loading: true }));
    
    if (!pendingUserId) {
      setState(prev => ({ ...prev, loading: false }));
      return { success: false, message: 'Session expired. Please try again.' };
    }

    try {
      const response = await apiService.verifyOTP(pendingUserId, otp);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      setState({
        isAuthenticated: true,
        user: response.user,
        loading: false,
      });
      setPendingUserId(null);
      setShowOTP(false);
      return { success: true, message: response.message };
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      return { success: false, message: error instanceof Error ? error.message : 'Invalid OTP. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    apiService.clearToken();
    setState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
    setPendingUserId(null);
    setCurrentView('home');
    setShowOTP(false);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (state.user) {
      try {
        const updatedUser = await apiService.updateProfile(updates);
        setState(prev => ({ ...prev, user: updatedUser }));
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      verifyOTP,
      logout,
      updateUser,
      pendingUser: null, // Keep for compatibility
      currentView,
      setCurrentView,
      showOTP,
      setShowOTP,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};