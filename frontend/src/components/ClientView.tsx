import React, { useState, useMemo } from 'react';
import { Product, CartItem, UserProfile, ViewState, Review, AdminSettings, Notification } from '../types/types';
import { api } from '../services/api';
import { NavBar } from './client/NavBar';
import { Footer } from './client/Footer';
import { Hero } from './client/Hero';
import { ProductGrid } from './client/ProductGrid';
import { ProductDetail } from './client/ProductDetail';
import { Profile } from './client/Profile';
import { CartDrawer } from './client/CartDrawer';
import { CheckoutModal } from './client/CheckoutModal';
import { AuthModal } from './client/AuthModal';
import { OrderConfirmation } from './client/OrderConfirmation';
import { Lock } from 'lucide-react';

interface ClientViewProps {
  products: Product[];
  reviews: Review[];
  settings: AdminSettings;
  currentUser: UserProfile;
  cart: CartItem[];
  addToCart: (p: Product) => void;
  updateUser: (u: UserProfile) => void;
  onNavigate: (view: ViewState) => void;
  notifications: Notification[];
  isLoggedIn: boolean;
  onLogin: (email: string, name?: string, address?: string, phone?: string, country?: string, countryCode?: string) => void;
  onPlaceOrder: (items: CartItem[], specialRequest: string) => void;
  onSubmitReview: (productId: string, comment: string, rating: number) => void;
  onDeleteAccount: () => void;
}

export const ClientView: React.FC<ClientViewProps> = ({ 
    products, reviews, settings, currentUser, cart, addToCart, updateUser, onNavigate, notifications, isLoggedIn, onLogin, onPlaceOrder, onSubmitReview, onDeleteAccount
}) => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [authError, setAuthError] = useState<string | null>(null);

  // Checkout State
  const [specialRequest, setSpecialRequest] = useState('');

  // Review State
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  // Handle Product Click
  const openProduct = (p: Product) => {
    setSelectedProduct(p);
    setView(ViewState.PRODUCT_DETAIL);
    setReviewText(''); // Reset review text
    setReviewRating(5);
  };

  const handleProfileClick = () => {
      if (isLoggedIn) {
          setView(ViewState.PROFILE);
      } else {
          setAuthMode('LOGIN');
          setAuthError(null);
          setShowAuthModal(true);
      }
  };

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setAuthError(null);

      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      // Validate Input using API utility
      const validationError = api.auth.validateClientPayload(email, password);
      if (validationError) {
          setAuthError(validationError);
          return;
      }

      try {
        if (authMode === 'SIGNUP') {
          // Call real registration API
          const name = formData.get('name') as string;
          const address = formData.get('address') as string;
          const country = formData.get('country') as string;
          const countryCode = formData.get('countryCode') as string;
          const phone = formData.get('phone') as string;

          const result = await api.auth.register({
            email, password, name, address, country, countryCode, phone
          });

          if (result.success) {
            // Switch to login after successful registration
            setAuthMode('LOGIN');
            setAuthError('Account created! Please log in.');
          } else {
            setAuthError(result.message || 'Registration failed');
          }
          return;
        }

        // Login mode - call real login API
        const result = await api.auth.loginClient(email, password);
        onLogin(
          result.user.email, 
          result.user.name, 
          result.user.address, 
          result.user.phone,
          result.user.country,
          result.user.countryCode
        );
        setShowAuthModal(false);
      } catch (error: any) {
        setAuthError(error.message);
      }
  };

  return (
    <div className="min-h-screen bg-fuchsia-50/50 flex flex-col">
      <NavBar 
        settings={settings}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setView={setView}
        view={view}
        isLoggedIn={isLoggedIn}
        notifications={notifications}
        isNotificationsOpen={isNotificationsOpen}
        setIsNotificationsOpen={setIsNotificationsOpen}
        setIsCartOpen={setIsCartOpen}
        cart={cart}
        handleProfileClick={handleProfileClick}
      />
      
      <CartDrawer 
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cart={cart}
        isLoggedIn={isLoggedIn}
        setShowCheckout={setShowCheckout}
        setAuthMode={setAuthMode}
        setAuthError={setAuthError}
        setShowAuthModal={setShowAuthModal}
        ownerName={settings.ownerName}
      />
      
      <CheckoutModal 
        showCheckout={showCheckout}
        setShowCheckout={setShowCheckout}
        cart={cart}
        currentUser={currentUser}
        settings={settings}
        specialRequest={specialRequest}
        setSpecialRequest={setSpecialRequest}
        onPlaceOrder={onPlaceOrder}
        setView={setView}
        ViewState={ViewState}
      />
      
      <AuthModal 
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        authMode={authMode}
        setAuthMode={setAuthMode}
        authError={authError}
        setAuthError={setAuthError}
        handleAuthSubmit={handleAuthSubmit}
        onNavigate={onNavigate}
      />
      
      <div className="flex-1">
        {view === ViewState.LANDING && (
          <>
            <Hero setView={setView} />
            <div className="py-8">
              <h2 className="text-3xl font-bold text-center text-purple-900 mb-8">
                {isLoggedIn ? 'Featured Warmth' : 'Preview Our Collection'}
              </h2>
              {!isLoggedIn && (
                <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                  Login to view prices, add items to your cart, and explore our full collection of handmade crochet items.
                </p>
              )}
              <ProductGrid 
                products={isLoggedIn ? filteredProducts : filteredProducts.slice(0, 3)}
                onProductClick={isLoggedIn ? openProduct : () => {}}
                addToCart={addToCart}
                setIsCartOpen={setIsCartOpen}
                isPreviewMode={!isLoggedIn}
                onLoginPrompt={() => {
                  setAuthMode('LOGIN');
                  setAuthError(null);
                  setShowAuthModal(true);
                }}
              />
            </div>
          </>
        )}

        {view === ViewState.SHOP && (
          <div className="py-8">
            {isLoggedIn ? (
              <>
                <h2 className="text-3xl font-bold text-center text-purple-900 mb-4">Browse Collection</h2>
                <ProductGrid 
                  products={filteredProducts}
                  onProductClick={openProduct}
                  addToCart={addToCart}
                  setIsCartOpen={setIsCartOpen}
                />
              </>
            ) : (
              <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <Lock size={64} className="mx-auto text-purple-600 mb-6" />
                <h2 className="text-3xl font-bold text-purple-900 mb-4">Login Required</h2>
                <p className="text-gray-600 mb-8">
                  Please login or create an account to browse our full collection and start shopping.
                </p>
                <button
                  onClick={() => {
                    setAuthMode('LOGIN');
                    setAuthError(null);
                    setShowAuthModal(true);
                  }}
                  className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition font-semibold"
                >
                  Login / Sign Up
                </button>
              </div>
            )}
          </div>
        )}

        {view === ViewState.ORDER_CONFIRMATION && (
          <OrderConfirmation 
            setView={setView}
            ownerName={settings.ownerName}
          />
        )}
        
        {view === ViewState.PRODUCT_DETAIL && (
          <ProductDetail 
            product={selectedProduct}
            reviews={reviews}
            isLoggedIn={isLoggedIn}
            reviewText={reviewText}
            reviewRating={reviewRating}
            setReviewText={setReviewText}
            setReviewRating={setReviewRating}
            onSubmitReview={onSubmitReview}
            addToCart={addToCart}
            setIsCartOpen={setIsCartOpen}
            setView={setView}
            setAuthMode={setAuthMode}
            setShowAuthModal={setShowAuthModal}
          />
        )}
        
        {view === ViewState.PROFILE && (
          <Profile 
            currentUser={currentUser}
            updateUser={updateUser}
            onNavigate={onNavigate}
            notifications={notifications}
            onDeleteAccount={onDeleteAccount}
          />
        )}
      </div>

      <Footer settings={settings} />
    </div>
  );
};
