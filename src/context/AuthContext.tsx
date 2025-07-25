import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { mockAPI } from '../data/mockDatabase';

export type ViewType = 'home' | 'rsvp' | 'schedule' | 'events' | 'location' | 'guests' | 'profile';

interface AuthContextType extends AuthState {
  login: (identifier: string) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (otp: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  pendingUser: { email?: string; phone?: string } | null;
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
  const [pendingUser, setPendingUser] = useState<{ email?: string; phone?: string } | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [showOTP, setShowOTP] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setState({
          isAuthenticated: true,
          user,
          loading: false,
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
        setState(prev => ({ ...prev, loading: false }));
      }
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (identifier: string): Promise<{ success: boolean; message: string }> => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const user = await mockAPI.findByEmailOrPhone(identifier);
      if (!user) {
        setState(prev => ({ ...prev, loading: false }));
        return { success: false, message: 'User not found. Please check your email or phone number.' };
      }
      
      setPendingUser({ email: user.email, phone: user.phone });
      setState(prev => ({ ...prev, loading: false }));
      setShowOTP(true);
      return { success: true, message: 'OTP sent successfully. Use 123456 for demo.' };
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      return { success: false, message: 'Connection error. Please try again.' };
    }
  };

  const verifyOTP = async (otp: string): Promise<{ success: boolean; message: string }> => {
    setState(prev => ({ ...prev, loading: true }));
    
    if (!pendingUser) {
      setState(prev => ({ ...prev, loading: false }));
      return { success: false, message: 'Session expired. Please try again.' };
    }

    // For demo, accept OTP 123456
    if (otp !== '123456') {
      setState(prev => ({ ...prev, loading: false }));
      return { success: false, message: 'Invalid OTP. Please use 123456 for demo.' };
    }

    try {
      const identifier = pendingUser.email || pendingUser.phone || '';
      const user = await mockAPI.findByEmailOrPhone(identifier);
      
      if (!user) {
        setState(prev => ({ ...prev, loading: false }));
        return { success: false, message: 'User not found.' };
      }
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      setState({
        isAuthenticated: true,
        user: user,
        loading: false,
      });
      setPendingUser(null);
      setShowOTP(false);
      return { success: true, message: 'Login successful!' };
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
    setPendingUser(null);
    setCurrentView('home');
    setShowOTP(false);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (state.user) {
      try {
        const updatedUser = await mockAPI.updateUser(state.user._id, updates);
        if (!updatedUser) return;
        
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
      pendingUser,
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