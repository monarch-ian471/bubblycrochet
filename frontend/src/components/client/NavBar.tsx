import React, { useRef, useEffect } from 'react';
import { Search, ShoppingBag, User, Bell } from 'lucide-react';
import { AdminLogo, YarnLogo } from '../Visuals';
import { AdminSettings, Notification, ViewState } from '../../types/types';

interface NavBarProps {
  settings: AdminSettings;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setView: (view: ViewState) => void;
  view: ViewState;
  isLoggedIn: boolean;
  notifications: Notification[];
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  setIsCartOpen: (open: boolean) => void;
  cart: any[];
  handleProfileClick: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({
  settings,
  searchQuery,
  setSearchQuery,
  setView,
  view,
  isLoggedIn,
  notifications,
  isNotificationsOpen,
  setIsNotificationsOpen,
  setIsCartOpen,
  cart,
  handleProfileClick
}) => {
  const notificationsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const handleNotificationsMouseEnter = () => {
    if (notificationsTimeoutRef.current) {
      clearTimeout(notificationsTimeoutRef.current);
      notificationsTimeoutRef.current = null;
    }
  };

  const handleNotificationsMouseLeave = () => {
    notificationsTimeoutRef.current = setTimeout(() => {
      setIsNotificationsOpen(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (notificationsTimeoutRef.current) {
        clearTimeout(notificationsTimeoutRef.current);
      }
    };
  }, []);

  return (
  <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-pink-100">
    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(ViewState.LANDING)}>
        <AdminLogo size="sm" />
        <span className="text-2xl font-bold text-purple-900 tracking-tight">{settings.storeName}</span>
      </div>

      <div className="hidden md:flex items-center bg-pink-50 px-4 py-2 rounded-full w-96 border border-pink-100 focus-within:border-purple-300 transition">
        <Search size={18} className="text-purple-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search for cozy items..." 
          className="bg-transparent border-none outline-none w-full text-purple-900 placeholder-purple-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setView(ViewState.SHOP)}
        />
      </div>

      <div className="flex items-center gap-6">
        <button onClick={() => setView(ViewState.SHOP)} className={`text-purple-900 font-semibold hover:text-pink-600 transition ${view === ViewState.SHOP ? 'text-pink-600' : ''}`}>Collections</button>
        <div className="flex items-center gap-4 border-l border-pink-200 pl-6 relative">
          {/* Notifications */}
          {isLoggedIn && (
            <div 
              className="relative" 
              ref={notificationsRef}
              onMouseEnter={handleNotificationsMouseEnter}
              onMouseLeave={handleNotificationsMouseLeave}
            >
              <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="text-purple-900 hover:text-pink-600 transition">
                <Bell size={24} />
                {notifications.filter(n => !n.read).length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full animate-pulse"></span>}
              </button>
              {isNotificationsOpen && (
                <div className="absolute top-10 right-0 w-80 bg-white shadow-xl rounded-xl border border-pink-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <h4 className="font-bold text-gray-700 mb-3 border-b border-gray-100 pb-2">Notifications</h4>
                  {notifications.length === 0 ? <p className="text-sm text-gray-400">No new notifications.</p> : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className={`text-sm p-2 rounded-lg ${n.read ? 'bg-white' : 'bg-pink-50'}`}>
                          <p className="text-gray-800">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(n.date).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <button onClick={() => setIsCartOpen(true)} className="relative text-purple-900 hover:text-pink-600 transition">
            <ShoppingBag size={24} />
            {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">{cart.length}</span>}
          </button>
          <button onClick={handleProfileClick} className="text-purple-900 hover:text-pink-600 transition">
            <User size={24} />
          </button>
        </div>
      </div>
    </div>
  </nav>
  );
};
