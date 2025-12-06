import React from 'react';
import { X, User, Send, Clock } from 'lucide-react';
import { CartItem, UserProfile, AdminSettings } from '../../types/types';

interface CheckoutModalProps {
  showCheckout: boolean;
  setShowCheckout: (show: boolean) => void;
  cart: CartItem[];
  currentUser: UserProfile;
  settings: AdminSettings;
  specialRequest: string;
  setSpecialRequest: (request: string) => void;
  onPlaceOrder: (items: CartItem[], specialRequest: string) => void;
  setView: (view: any) => void;
  ViewState: any;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  showCheckout,
  setShowCheckout,
  cart,
  currentUser,
  settings,
  specialRequest,
  setSpecialRequest,
  onPlaceOrder,
  setView,
  ViewState
}) => {
  if (!showCheckout) return null;
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cart.reduce((sum, item) => sum + item.shippingCost * item.quantity, 0);
  const maxDays = Math.max(...cart.map(c => c.daysToMake));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCheckout(false)}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 bg-purple-600 text-white flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Send /> Contact Owner & Place Order</h2>
          <button onClick={() => setShowCheckout(false)} className="hover:bg-purple-700 p-2 rounded-full"><X size={20}/></button>
        </div>
        <div className="p-8 space-y-6">
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex gap-4 items-start">
            <div className="bg-white p-2 rounded-full shadow-sm"><User className="text-purple-600"/></div>
            <div>
              <h3 className="font-bold text-purple-900">Owner Contact</h3>
              <p className="text-sm text-gray-600">{settings.ownerName}</p>
              <p className="text-sm text-gray-600">{settings.contactEmail}</p>
              <p className="text-sm text-gray-600">{settings.contactPhone}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 border-b pb-2">Your Details (Pre-filled)</h3>
            <div className="grid grid-cols-2 gap-4">
              <input className="bg-gray-100 p-3 rounded-lg text-gray-600 cursor-not-allowed" value={currentUser.name} disabled />
              <input className="bg-gray-100 p-3 rounded-lg text-gray-600 cursor-not-allowed" value={currentUser.email} disabled />
              <input className="bg-gray-100 p-3 rounded-lg text-gray-600 cursor-not-allowed col-span-2" value={currentUser.address || 'No address provided'} disabled />
              <input className="bg-gray-100 p-3 rounded-lg text-gray-600 cursor-not-allowed" value={currentUser.country || 'No country provided'} disabled />
              <input className="bg-gray-100 p-3 rounded-lg text-gray-600 cursor-not-allowed" value={`${currentUser.countryCode || ''} ${currentUser.phone || 'No phone provided'}`} disabled />
            </div>
            {(!currentUser.address || !currentUser.country) && <p className="text-xs text-red-500">Please update your address and country in your profile for delivery!</p>}
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 border-b pb-2">Order Summary</h3>
            <div className="bg-gray-50 p-4 rounded-xl space-y-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                <span>Total (inc. ${shipping} shipping)</span>
                <span>${(subtotal + shipping).toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 mt-2 flex items-center gap-1"><Clock size={12}/> Estimated ready in ~{maxDays} days</div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-2">Special Request / Note</h3>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-900" 
              rows={3}
              placeholder="Any specific colors, size adjustments, or gift notes?"
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
            />
          </div>

          <button 
            onClick={() => {
              if (!currentUser.address) {
                alert("Please add a shipping address in your profile first.");
                setView(ViewState.PROFILE);
                setShowCheckout(false);
                return;
              }
              onPlaceOrder(cart, specialRequest);
              setShowCheckout(false);
              setView(ViewState.ORDER_CONFIRMATION);
            }}
            className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition shadow-lg"
          >
            Confirm & Send Order Request
          </button>
        </div>
      </div>
    </div>
  );
};
