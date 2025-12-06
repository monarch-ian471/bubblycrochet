import React from 'react';
import { AlertCircle } from 'lucide-react';
import { YarnLogo } from '../Visuals';
import { ViewState } from '../../types';

interface AuthModalProps {
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authMode: 'LOGIN' | 'SIGNUP';
  setAuthMode: (mode: 'LOGIN' | 'SIGNUP') => void;
  authError: string | null;
  setAuthError: (error: string | null) => void;
  handleAuthSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onNavigate: (view: ViewState) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  showAuthModal,
  setShowAuthModal,
  authMode,
  setAuthMode,
  authError,
  setAuthError,
  handleAuthSubmit,
  onNavigate
}) => {
  if (!showAuthModal) return null;
  
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAuthModal(false)}></div>
      <div className="relative bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full animate-in zoom-in-95">
        <div className="text-center mb-6">
          <YarnLogo size="sm" animated />
          <h2 className="text-2xl font-bold text-purple-900 mt-4">{authMode === 'LOGIN' ? 'Welcome Back!' : 'Join the Club'}</h2>
          <p className="text-gray-500 text-sm">Sign in to save your favorite items and track orders.</p>
        </div>
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {authError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center text-sm">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" />
              {authError}
            </div>
          )}
          <input name="email" type="email" placeholder="Email Address" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900" />
          {authMode === 'SIGNUP' && (
            <>
              <input name="name" type="text" placeholder="Full Name" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900" />
              <input name="address" type="text" placeholder="Full Delivery Address" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900" />
              <input name="phone" type="text" placeholder="Phone Number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900" />
            </>
          )}
          <input name="password" type="password" placeholder="Password" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900" />
          
          <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition">
            {authMode === 'LOGIN' ? 'Log In' : 'Create Account'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button onClick={() => { setAuthMode(authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN'); setAuthError(null); }} className="text-purple-600 text-sm hover:underline font-semibold">
            {authMode === 'LOGIN' ? "New here? Create an account" : "Already have an account? Log In"}
          </button>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <button onClick={() => onNavigate(ViewState.LOGIN)} className="text-xs text-gray-400 hover:text-purple-500">Admin Login</button>
        </div>
      </div>
    </div>
  );
};
