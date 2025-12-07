import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, Package, Settings, ShoppingCart, Bell, Compass } from 'lucide-react';
import { Notification } from '../../types/types';

interface SidebarProps {
  activeTab: 'DASHBOARD' | 'PRODUCTS' | 'ORDERS' | 'SETTINGS' | 'JOURNEY';
  setActiveTab: (tab: 'DASHBOARD' | 'PRODUCTS' | 'ORDERS' | 'SETTINGS' | 'JOURNEY') => void;
  onLogout: () => void;
  unreadOrdersCount: number;
  logoUrl?: string;
  storeName?: string;
  notifications: Notification[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, unreadOrdersCount, logoUrl, storeName, notifications }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
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

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
  <aside className="w-64 bg-white border-r border-pink-100 flex flex-col shadow-lg z-10">
    <div className="p-6 border-b border-pink-50">
      <div className="flex items-center gap-3">
        {logoUrl && (
          <img src={logoUrl} alt="Logo" className="w-12 h-12 rounded-full border-2 border-pink-200 object-cover" />
        )}
        <div className="flex-1">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 flex items-center gap-2">
            {storeName || 'Admin Panel'}
          </div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse mt-1"></div>
        </div>
      </div>
    </div>
    <nav className="flex-1 p-4 space-y-2">
      <button 
        onClick={() => setActiveTab('DASHBOARD')}
        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'DASHBOARD' ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
      >
        <LayoutDashboard size={20} /> <span>Dashboard</span>
      </button>
      <button 
        onClick={() => setActiveTab('PRODUCTS')}
        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'PRODUCTS' ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
      >
        <Package size={20} /> <span>Products</span>
      </button>
      <button 
        onClick={() => setActiveTab('ORDERS')}
        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'ORDERS' ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
      >
        <div className="relative">
          <ShoppingCart size={20} />
          {unreadOrdersCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 w-2 h-2 rounded-full"></span>}
        </div> 
        <span>Orders</span>
      </button>
      <button 
        onClick={() => setActiveTab('JOURNEY')}
        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'JOURNEY' ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
      >
        <Compass size={20} /> <span>Journey</span>
      </button>
      <button 
        onClick={() => setActiveTab('SETTINGS')}
        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'SETTINGS' ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
      >
        <Settings size={20} /> <span>Settings</span>
      </button>
    </nav>
    
    {/* Notifications Section */}
    <div className="p-4 border-t border-pink-50">
      <div 
        className="relative"
        ref={notificationsRef}
        onMouseEnter={handleNotificationsMouseEnter}
        onMouseLeave={handleNotificationsMouseLeave}
      >
        <button 
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          className="w-full flex items-center space-x-3 p-3 rounded-xl transition text-gray-500 hover:bg-gray-50 relative"
        >
          <Bell size={20} />
          <span>Notifications</span>
          {unreadNotifications > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
              {unreadNotifications}
            </span>
          )}
        </button>
        
        {isNotificationsOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white shadow-xl rounded-xl border border-pink-100 p-4 z-50 max-h-96 overflow-hidden">
            <h4 className="font-bold text-gray-700 mb-3 border-b border-gray-100 pb-2">Admin Notifications</h4>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-400">No notifications.</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.slice(0, 10).map(n => (
                  <div key={n.id} className={`text-sm p-2 rounded-lg ${n.read ? 'bg-white' : 'bg-purple-50'}`}>
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(n.date).toLocaleDateString()} • {new Date(n.date).toLocaleTimeString()}</p>
                      </div>
                      {!n.read && <div className="w-2 h-2 bg-purple-500 rounded-full mt-1 flex-shrink-0"></div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    
    <div className="p-4 border-t border-pink-50">
      <button onClick={onLogout} className="w-full flex items-center space-x-2 text-red-500 p-2 hover:bg-red-50 rounded-lg transition">
        <span>Sign Out</span>
      </button>
    </div>
  </aside>
  );
};
