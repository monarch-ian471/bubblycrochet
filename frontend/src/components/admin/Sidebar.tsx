import React from 'react';
import { LayoutDashboard, Package, Settings, ShoppingCart } from 'lucide-react';

interface SidebarProps {
  activeTab: 'DASHBOARD' | 'PRODUCTS' | 'ORDERS' | 'SETTINGS';
  setActiveTab: (tab: 'DASHBOARD' | 'PRODUCTS' | 'ORDERS' | 'SETTINGS') => void;
  onLogout: () => void;
  unreadOrdersCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, unreadOrdersCount }) => (
  <aside className="w-64 bg-white border-r border-pink-100 flex flex-col shadow-lg z-10">
    <div className="p-6 border-b border-pink-50">
      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-50 flex items-center gap-2">
        <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
        Admin
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
        onClick={() => setActiveTab('SETTINGS')}
        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'SETTINGS' ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
      >
        <Settings size={20} /> <span>Settings</span>
      </button>
    </nav>
    <div className="p-4 border-t border-pink-50">
      <button onClick={onLogout} className="w-full flex items-center space-x-2 text-red-500 p-2 hover:bg-red-50 rounded-lg transition">
        <span>Sign Out</span>
      </button>
    </div>
  </aside>
);
