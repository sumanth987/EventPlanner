import React from 'react';
import { Home, Users, Calendar, MapPin, UserPlus, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  if (!user) return null;

  const adminNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'rsvp', label: 'RSVP List', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'events', label: 'Events', icon: MapPin },
    { id: 'location', label: 'Location', icon: MapPin },
  ];

  const guestNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'guests', label: 'Guests', icon: UserPlus },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'events', label: 'Events', icon: MapPin },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const navItems = user.isAdmin ? adminNavItems : guestNavItems;

  const handleNavClick = (viewId: string) => {
    onViewChange(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50 safe-area-top">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Event Manager</h1>
              <p className="text-xs text-gray-500">{user.isAdmin ? 'Admin' : 'Guest'}</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="bg-white w-80 max-w-[85vw] h-full shadow-xl animate-slide-right" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200 pt-20 safe-area-top">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">E</span>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{user.name}</h2>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
              <nav className="p-4 overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        currentView === item.id
                          ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-40 safe-area-bottom">
          <div className="flex justify-around items-center max-w-md mx-auto">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-all min-w-0 flex-1 ${
                    currentView === item.id
                      ? 'text-indigo-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex">
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen fixed left-0 top-0 z-30">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Event Manager</h2>
                <p className="text-sm text-gray-500">{user.isAdmin ? 'Admin Panel' : 'Guest Access'}</p>
              </div>
            </div>
          </div>
          
          <nav className="p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all mb-1 ${
                    currentView === item.id
                      ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}