import React from 'react';
import { Package, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import { Product, Order } from '../../types/types';

interface DashboardProps {
  products: Product[];
  orders: Order[];
  unreadOrdersCount: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ products, orders, unreadOrdersCount }) => {
  // Calculate real revenue from orders
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const completedOrders = orders.filter(o => o.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-purple-900">Dashboard Overview</h2>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100 flex items-center space-x-4">
          <div className="p-3 bg-pink-100 text-pink-600 rounded-full"><Package /></div>
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-gray-800">{products.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><TrendingUp /></div>
          <div>
            <p className="text-sm text-gray-500">Completed Orders</p>
            <p className="text-2xl font-bold text-gray-800">{completedOrders}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full"><DollarSign /></div>
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100 flex items-center space-x-4 relative">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><ShoppingCart /></div>
          <div>
            <p className="text-sm text-gray-500">Pending Orders</p>
            <p className="text-2xl font-bold text-gray-800">{pendingOrders}</p>
          </div>
          {unreadOrdersCount > 0 && <span className="absolute top-4 right-4 bg-red-500 w-3 h-3 rounded-full animate-ping"></span>}
        </div>
      </div>

      {/* Analytics Section - Ready for Database Integration */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100">
        <h3 className="text-purple-900 font-semibold mb-4">Recent Activity</h3>
        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">Order #{order.id.slice(-6)}</p>
                  <p className="text-sm text-gray-500">{order.userName}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">${order.totalAmount.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No orders yet. Data will appear here once orders are placed.</p>
        )}
      </div>
    </div>
  );
};
