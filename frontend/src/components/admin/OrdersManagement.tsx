import React from 'react';
import { Clock } from 'lucide-react';
import { Order } from '../../types';

interface OrdersManagementProps {
  orders: Order[];
  updateOrder: (orderId: string, status: Order['status']) => void;
}

export const OrdersManagement: React.FC<OrdersManagementProps> = ({ orders, updateOrder }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-purple-900">Orders & Reviews</h2>
    <div className="bg-white rounded-xl shadow-sm border border-pink-100 overflow-hidden">
      {orders.length === 0 ? (
        <div className="p-12 text-center text-gray-400">No orders yet.</div>
      ) : (
        <div className="divide-y divide-pink-50">
          {orders.map(order => (
            <div key={order.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-purple-900">Order #{order.id.slice(-6)}</h3>
                  <p className="text-sm text-gray-500">From: <span className="font-medium text-gray-800">{order.userName}</span></p>
                  <p className="text-sm text-gray-500">Date: {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : order.status === 'REVIEWED' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-xl mt-2 text-gray-800">${(order.totalAmount + order.shippingTotal).toFixed(2)}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Items</h4>
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm mb-1">
                    <span>{item.quantity}x {item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm mt-2 pt-2 border-t border-gray-200 font-bold">
                  <span>Shipping</span>
                  <span>${order.shippingTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <h4 className="text-xs font-bold text-purple-500 uppercase mb-1">Client Special Request</h4>
                <p className="text-sm text-gray-700 italic">"{order.specialRequest || 'None'}"</p>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg mb-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Shipping Details</h4>
                <p className="text-sm text-gray-700">{order.shippingAddress}</p>
                <p className="text-sm text-gray-700 mt-1">Contact: {order.contactEmail}</p>
              </div>
              
              <div className="flex gap-2 justify-end">
                {order.status === 'PENDING' && (
                  <button onClick={() => updateOrder(order.id, 'REVIEWED')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">Mark as Reviewed</button>
                )}
                {order.status === 'REVIEWED' && (
                  <button onClick={() => updateOrder(order.id, 'ACCEPTED')} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700">Accept Order</button>
                )}
                {(order.status === 'ACCEPTED' || order.status === 'REVIEWED') && (
                  <button onClick={() => updateOrder(order.id, 'COMPLETED')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">Complete & Ship</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
