import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

interface OfflineIndicatorProps {
  isOnline?: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isOnline: propIsOnline }) => {
  const { isOnline: hookIsOnline } = usePWA();
  const isOnline = propIsOnline !== undefined ? propIsOnline : hookIsOnline;
  const [showOffline, setShowOffline] = React.useState(false);

  React.useEffect(() => {
    if (!isOnline) {
      setShowOffline(true);
    } else {
      const timer = setTimeout(() => setShowOffline(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!showOffline) return null;

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
      isOnline ? 'animate-slide-up' : 'animate-slide-down'
    }`}>
      <div className={`px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 ${
        isOnline 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
      }`}>
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Back online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">You're offline</span>
          </>
        )}
      </div>
    </div>
  );
};