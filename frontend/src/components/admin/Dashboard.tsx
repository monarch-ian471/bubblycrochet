import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import { MatrixVis } from '../Visuals';
import { Product, Order } from '../../types';

interface DashboardProps {
  products: Product[];
  orders: Order[];
  unreadOrdersCount: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ products, orders, unreadOrdersCount }) => {
  const data = [
    { name: 'Mon', visits: 400, sales: 24 },
    { name: 'Tue', visits: 300, sales: 13 },
    { name: 'Wed', visits: 500, sales: 98 },
    { name: 'Thu', visits: 280, sales: 39 },
    { name: 'Fri', visits: 590, sales: 48 },
    { name: 'Sat', visits: 800, sales: 120 },
    { name: 'Sun', visits: 700, sales: 110 },
  ];

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
            <p className="text-sm text-gray-500">Total Visits</p>
            <p className="text-2xl font-bold text-gray-800">3,429</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full"><DollarSign /></div>
          <div>
            <p className="text-sm text-gray-500">Revenue (Est)</p>
            <p className="text-2xl font-bold text-gray-800">$1,250</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100 flex items-center space-x-4 relative">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><ShoppingCart /></div>
          <div>
            <p className="text-sm text-gray-500">New Orders</p>
            <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
          </div>
          {unreadOrdersCount > 0 && <span className="absolute top-4 right-4 bg-red-500 w-3 h-3 rounded-full animate-ping"></span>}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100 h-96">
          <h3 className="text-purple-900 font-semibold mb-4">Weekly Engagement</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0abfc" vertical={false} />
              <XAxis dataKey="name" stroke="#86198f" />
              <YAxis stroke="#86198f" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} cursor={{fill: '#fce7f3'}} />
              <Bar dataKey="visits" fill="#d946ef" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sales" fill="#7e22ce" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* The Matrix D3 Aspect */}
        <MatrixVis dataPoints={products.length * 5 + orders.length * 10} />
      </div>
    </div>
  );
};
