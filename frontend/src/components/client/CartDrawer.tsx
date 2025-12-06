import React, { useRef, useEffect } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { CartItem } from '../../types/types';

interface CartDrawerProps {
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cart: CartItem[];
  isLoggedIn: boolean;
  setShowCheckout: (show: boolean) => void;
  setAuthMode: (mode: 'LOGIN' | 'SIGNUP') => void;
  setAuthError: (error: string | null) => void;
  setShowAuthModal: (show: boolean) => void;
  ownerName: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isCartOpen,
  setIsCartOpen,
  cart,
  isLoggedIn,
  setShowCheckout,
  setAuthMode,
  setAuthError,
  setShowAuthModal,
  ownerName
}) => {
  const cartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  const handleCartMouseEnter = () => {
    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
      cartTimeoutRef.current = null;
    }
  };

  const handleCartMouseLeave = () => {
    cartTimeoutRef.current = setTimeout(() => {
      setIsCartOpen(false);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (cartTimeoutRef.current) {
        clearTimeout(cartTimeoutRef.current);
      }
    };
  }, []);

  // Calculate actual price considering discounts
  const getItemPrice = (item: CartItem) => {
    if (item.discount && item.discount > 0) {
      return item.price * (1 - item.discount / 100);
    }
    return item.price;
  };

  const subtotal = cart.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
  const estimatedShipping = cart.reduce((sum, item) => sum + item.shippingCost * item.quantity, 0);

  return (
    <div className={`fixed inset-0 z-[60] flex justify-end transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
      <div 
        ref={cartRef}
        onMouseEnter={handleCartMouseEnter}
        onMouseLeave={handleCartMouseLeave}
        className={`relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-pink-50">
          <h2 className="text-2xl font-bold text-purple-900 flex items-center gap-2"><ShoppingBag /> Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white rounded-full transition"><X /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
              <p>Your cart feels a bit light...</p>
            </div>
          ) : (
            cart.map((item, i) => (
              <div key={i} className="flex gap-4">
                <img src={item.images[0]} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{item.name}</h4>
                  {item.discount && item.discount > 0 ? (
                    <div className="flex items-center gap-2">
                      <p className="text-gray-400 text-sm line-through">${item.price.toFixed(2)}</p>
                      <p className="text-purple-600 font-bold">${getItemPrice(item).toFixed(2)}</p>
                    </div>
                  ) : (
                    <p className="text-purple-600 font-bold">${item.price.toFixed(2)}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                    <span className="text-xs text-gray-400">Ship: ${item.shippingCost}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Est. Shipping</span>
              <span>${estimatedShipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>${(subtotal + estimatedShipping).toFixed(2)}</span>
            </div>
          </div>
          <button 
            onClick={() => {
              setIsCartOpen(false);
              if (!isLoggedIn) {
                setAuthMode('LOGIN');
                setAuthError(null);
                setShowAuthModal(true);
              } else {
                setShowCheckout(true);
              }
            }}
            className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
          >
            Contact Owner to Buy
          </button>
          <p className="text-center text-xs text-gray-500 mt-4">We'll connect you directly with {ownerName} to finalize details!</p>
        </div>
      </div>
    </div>
  );
};
