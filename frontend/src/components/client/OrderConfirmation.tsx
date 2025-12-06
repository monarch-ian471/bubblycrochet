import React from 'react';
import { CheckCircle } from 'lucide-react';
import { ViewState } from '../../types';

interface OrderConfirmationProps {
  setView: (view: ViewState) => void;
  ownerName: string;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ setView, ownerName }) => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
      <CheckCircle size={48} className="text-green-600" />
    </div>
    <h2 className="text-3xl font-bold text-purple-900 mb-2">Order Request Sent!</h2>
    <p className="text-gray-600 max-w-md mb-8">
      Thank you for supporting handmade! We've sent your request to {ownerName}. 
      You'll receive a notification when your order is reviewed and accepted.
    </p>
    <div className="flex gap-4">
      <button onClick={() => setView(ViewState.SHOP)} className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition">
        Continue Shopping
      </button>
      <button onClick={() => setView(ViewState.PROFILE)} className="bg-white border border-purple-200 text-purple-700 px-6 py-3 rounded-full font-semibold hover:bg-purple-50 transition">
        View Order Status
      </button>
    </div>
  </div>
);
