import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { OTPVerification } from './components/auth/OTPVerification';
import { Navigation } from './components/layout/Navigation';
import { AdminHome } from './components/views/AdminHome';
import { GuestHome } from './components/views/GuestHome';
import { RSVPList } from './components/views/RSVPList';
import { ScheduleView } from './components/views/ScheduleView';
import { EventsView } from './components/views/EventsView';
import { LocationView } from './components/views/LocationView';
import { GuestsView } from './components/views/GuestsView';
import { ProfileView } from './components/views/ProfileView';
import { InstallPrompt } from './components/common/InstallPrompt';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { PullToRefresh } from './components/common/PullToRefresh';
import { usePWA } from './hooks/usePWA';
import { useNotifications } from './hooks/useNotifications';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { user, currentView, setCurrentView, showOTP, loading } = useAuth();
  const { isOnline } = usePWA();
  const { requestPermission } = useNotifications();

  React.useEffect(() => {
    if (user && !showOTP) {
      requestPermission();
    }
  }, [user, showOTP, requestPermission]);

  const handleRefresh = async () => {
    // Simulate refresh action
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show OTP verification if showOTP is true
  if (showOTP) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <OTPVerification />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <LoginForm />
      </div>
    );
  }

  if (!user.verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            Your account is pending verification. Please wait for admin approval to access the event details.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return user.isAdmin ? <AdminHome /> : <GuestHome />;
      case 'rsvp':
        return <RSVPList />;
      case 'schedule':
        return <ScheduleView />;
      case 'events':
        return <EventsView />;
      case 'location':
        return <LocationView />;
      case 'guests':
        return <GuestsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return user.isAdmin ? <AdminHome /> : <GuestHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <PullToRefresh onRefresh={handleRefresh}>
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
        <main className="pt-16 pb-20 md:pt-0 md:pb-4 md:ml-64 min-h-screen">
          <div className="p-4 md:p-6 max-w-full overflow-x-hidden">
            {renderView()}
          </div>
        </main>
        <InstallPrompt />
        <OfflineIndicator />
      </PullToRefresh>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;