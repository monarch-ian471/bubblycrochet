import React, { useState, useMemo } from 'react';
import { Product, CartItem, UserProfile, ViewState, Review, AdminSettings, Order, Notification } from '../types';
import { Search, ShoppingBag, User, Heart, MessageCircle, Star, X, Send, ArrowLeft, Edit2, LogIn, Bell, CheckCircle, MapPin, Clock, Truck, Instagram, Youtube, AlertCircle } from 'lucide-react';
import { FadeIn, YarnLogo } from './Visuals';
import { api } from '../services/api';

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
  onLogin: (email: string, name?: string, address?: string, phone?: string) => void;
  onPlaceOrder: (items: CartItem[], specialRequest: string) => void;
  onSubmitReview: (productId: string, comment: string, rating: number) => void;
}

export const ClientView: React.FC<ClientViewProps> = ({ 
    products, reviews, settings, currentUser, cart, addToCart, updateUser, onNavigate, notifications, isLoggedIn, onLogin, onPlaceOrder, onSubmitReview
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

  const handleAuthSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setAuthError(null);

      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const name = formData.get('name') as string;
      const address = formData.get('address') as string;
      const phone = formData.get('phone') as string;

      // Validate Input using API utility
      const validationError = api.auth.validateClientPayload(email, password);
      if (validationError) {
          setAuthError(validationError);
          return;
      }

      // If valid, proceed to login (In a real app, we would await api.auth.loginClient(email, password))
      onLogin(email, name, address, phone);
      setShowAuthModal(false);
  };

  // --- Components ---

  const NavBar = () => (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(ViewState.LANDING)}>
                <YarnLogo size="sm" />
                <span className="text-2xl font-bold text-purple-900 tracking-tight">{settings.storeName}</span>
            </div>

            <div className="hidden md:flex items-center bg-pink-50 px-4 py-2 rounded-full w-96 border border-pink-100 focus-within:border-purple-300 transition">
                <Search size={18} className="text-purple-400 mr-2" />
                <input 
                    type="text" 
                    placeholder="Search for cozy items..." 
                    className="bg-transparent border-none outline-none w-full text-purple-900 placeholder-purple-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setView(ViewState.SHOP)}
                />
            </div>

            <div className="flex items-center gap-6">
                <button onClick={() => setView(ViewState.SHOP)} className={`text-purple-900 font-semibold hover:text-pink-600 transition ${view === ViewState.SHOP ? 'text-pink-600' : ''}`}>Collections</button>
                <div className="flex items-center gap-4 border-l border-pink-200 pl-6 relative">
                    {/* Notifications */}
                    {isLoggedIn && (
                        <div className="relative">
                            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="text-purple-900 hover:text-pink-600 transition">
                                <Bell size={24} />
                                {notifications.filter(n => !n.read).length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full animate-pulse"></span>}
                            </button>
                            {isNotificationsOpen && (
                                <div className="absolute top-10 right-0 w-80 bg-white shadow-xl rounded-xl border border-pink-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                                    <h4 className="font-bold text-gray-700 mb-3 border-b border-gray-100 pb-2">Notifications</h4>
                                    {notifications.length === 0 ? <p className="text-sm text-gray-400">No new notifications.</p> : (
                                        <div className="space-y-3 max-h-60 overflow-y-auto">
                                            {notifications.map(n => (
                                                <div key={n.id} className={`text-sm p-2 rounded-lg ${n.read ? 'bg-white' : 'bg-pink-50'}`}>
                                                    <p className="text-gray-800">{n.message}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{new Date(n.date).toLocaleDateString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <button onClick={() => setIsCartOpen(true)} className="relative text-purple-900 hover:text-pink-600 transition">
                        <ShoppingBag size={24} />
                        {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">{cart.length}</span>}
                    </button>
                    <button onClick={handleProfileClick} className="text-purple-900 hover:text-pink-600 transition">
                        <User size={24} />
                    </button>
                </div>
            </div>
        </div>
    </nav>
  );

  const Footer = () => (
      <footer className="bg-purple-900 text-purple-200 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col items-center md:items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                        <span className="text-xl">🧶</span>
                    </div>
                    <span className="text-xl font-bold text-white">{settings.storeName}</span>
                  </div>
                  <p className="text-sm opacity-70">Handcrafted with love in {settings.shopLocation || 'our studio'}.</p>
                  
                  {/* Social Links */}
                  <div className="flex gap-4 mt-4">
                      {settings.instagramUrl && (
                          <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
                              <Instagram size={20} className="text-pink-400" />
                          </a>
                      )}
                      {settings.tiktokUrl && (
                          <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
                             {/* TikTok Icon Placeholder (Letter T in circle style) */}
                             <div className="w-5 h-5 flex items-center justify-center font-bold text-white text-xs">T</div>
                          </a>
                      )}
                      {settings.youtubeUrl && (
                          <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
                              <Youtube size={20} className="text-red-500" />
                          </a>
                      )}
                  </div>
              </div>
              <div className="text-sm opacity-60">
                  {settings.copyrightText}
              </div>
          </div>
      </footer>
  );

  const Hero = () => (
    <div className="bg-gradient-to-b from-purple-100 to-fuchsia-50 py-20 px-4 text-center">
        <FadeIn>
            <h1 className="text-5xl md:text-6xl font-bold text-purple-900 mb-6">Handmade with Love,<br/>Stitched for You</h1>
            <p className="text-xl text-purple-700 mb-8 max-w-2xl mx-auto">Discover unique, handcrafted crochet treasures made to bring warmth and joy to your home.</p>
            <button 
                onClick={() => setView(ViewState.SHOP)}
                className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 hover:scale-105 transition transform"
            >
                Explore Collections
            </button>
        </FadeIn>
    </div>
  );

  const ProductGrid = () => (
    <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
                <div key={product.id} onClick={() => openProduct(product)} className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition cursor-pointer group">
                    <div className="relative h-64 overflow-hidden">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                        {product.discount && product.discount > 0 && (
                            <span className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">-{product.discount}% OFF</span>
                        )}
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition">{product.name}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{product.description}</p>
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-2xl font-bold text-purple-900">${product.price}</span>
                                <div className="flex items-center text-xs text-gray-400 mt-1 gap-1"><Clock size={12}/> {product.daysToMake}d make time</div>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); addToCart(product); setIsCartOpen(true); }}
                                className="bg-pink-100 text-pink-600 p-3 rounded-full hover:bg-pink-500 hover:text-white transition"
                            >
                                <ShoppingBag size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  const ProductDetail = () => {
    if (!selectedProduct) return null;
    return (
        <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in zoom-in-95 duration-300">
            <button onClick={() => setView(ViewState.SHOP)} className="flex items-center text-purple-600 mb-6 hover:underline"><ArrowLeft size={20} className="mr-2"/> Back to Collections</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-3xl shadow-sm border border-pink-50">
                <div className="space-y-4">
                    <img src={selectedProduct.images[0]} className="w-full rounded-2xl shadow-lg" alt={selectedProduct.name}/>
                    <div className="grid grid-cols-4 gap-2">
                        {selectedProduct.images.slice(0, 4).map((img, i) => (
                            <img key={i} src={img} className="w-full h-24 object-cover rounded-lg cursor-pointer opacity-70 hover:opacity-100" />
                        ))}
                    </div>
                </div>
                <div className="space-y-6">
                    <div>
                        <span className="text-pink-500 font-bold tracking-wider text-sm uppercase">{selectedProduct.category}</span>
                        <h1 className="text-4xl font-bold text-purple-900 mt-2">{selectedProduct.name}</h1>
                        <div className="flex items-center mt-4 space-x-4">
                             <span className="text-3xl font-bold text-gray-800">${selectedProduct.price}</span>
                             {selectedProduct.discount && <span className="text-xl text-gray-400 line-through">${(selectedProduct.price * (1 + selectedProduct.discount/100)).toFixed(2)}</span>}
                        </div>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Clock size={16}/> Ready in ~{selectedProduct.daysToMake} days</span>
                            <span className="flex items-center gap-1"><Truck size={16}/> Shipping: ${selectedProduct.shippingCost}</span>
                        </div>
                    </div>
                    
                    <p className="text-gray-600 text-lg leading-relaxed">{selectedProduct.description}</p>

                    <button 
                        onClick={() => { addToCart(selectedProduct); setIsCartOpen(true); }}
                        className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition flex items-center justify-center gap-3"
                    >
                        <ShoppingBag /> Add to Cart
                    </button>

                    <div className="border-t border-gray-100 pt-6 mt-6">
                        <h3 className="font-bold text-gray-800 mb-4">Customer Reviews</h3>
                        <div className="space-y-4">
                            {reviews.filter(r => r.productId === selectedProduct.id).map(review => (
                                <div key={review.id} className="bg-gray-50 p-4 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <span className="font-bold text-sm text-purple-900 block">{review.userName}</span>
                                            <span className="text-xs text-gray-400">{review.date}</span>
                                        </div>
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />)}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm">{review.comment}</p>
                                </div>
                            ))}
                            {reviews.filter(r => r.productId === selectedProduct.id).length === 0 && (
                                <p className="text-gray-400 italic">No reviews yet. Be the first!</p>
                            )}
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            {isLoggedIn ? (
                                <div className="space-y-3">
                                    <h4 className="font-bold text-gray-800">Leave a Review</h4>
                                    <div className="flex items-center gap-2 mb-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button 
                                                key={star} 
                                                type="button" 
                                                onClick={() => setReviewRating(star)}
                                                className="text-yellow-400 hover:scale-110 transition"
                                            >
                                                <Star size={24} fill={star <= reviewRating ? "currentColor" : "none"} />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input 
                                            className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-900" 
                                            placeholder="Share your thoughts..." 
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                        />
                                        <button 
                                            onClick={() => {
                                                if (reviewText.trim()) {
                                                    onSubmitReview(selectedProduct.id, reviewText, reviewRating);
                                                    setReviewText('');
                                                }
                                            }}
                                            className="bg-purple-600 text-white px-4 rounded-lg font-bold hover:bg-purple-700 transition"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-purple-50 p-4 rounded-lg text-center">
                                    <p className="text-purple-800 text-sm mb-2">Want to leave a review?</p>
                                    <button 
                                        onClick={() => { setAuthMode('LOGIN'); setShowAuthModal(true); }}
                                        className="text-purple-600 font-bold hover:underline"
                                    >
                                        Log in or Sign up
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const Profile = () => (
      <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-pink-100 flex flex-col md:flex-row gap-8 items-start">
              <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
                  <div className="relative">
                    <img src={currentUser.avatar} className="w-40 h-40 rounded-full border-4 border-pink-200 object-cover" />
                    <button className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700"><Edit2 size={16}/></button>
                  </div>
                  <h2 className="text-2xl font-bold text-purple-900">{currentUser.name}</h2>
                  <p className="text-gray-500 text-center text-sm">{currentUser.email}</p>
                  
                  <button 
                    onClick={() => onNavigate(ViewState.LOGIN)} 
                    className="flex items-center gap-2 text-red-500 font-semibold hover:bg-red-50 px-6 py-2 rounded-lg transition mt-4"
                  >
                     <LogIn size={20} /> Sign Out
                  </button>
              </div>
              <div className="w-full md:w-2/3 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <h3 className="font-bold text-gray-800 mb-2">Shipping Address</h3>
                          <textarea 
                            className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-200 text-gray-900" 
                            defaultValue={currentUser.address}
                            placeholder="Enter your full address for deliveries..."
                            onBlur={(e) => updateUser({...currentUser, address: e.target.value})}
                          />
                      </div>
                      <div>
                          <h3 className="font-bold text-gray-800 mb-2">Phone</h3>
                          <input 
                            className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-200 text-gray-900" 
                            defaultValue={currentUser.phone}
                            placeholder="+1 (555) 000-0000"
                            onBlur={(e) => updateUser({...currentUser, phone: e.target.value})}
                          />
                      </div>
                  </div>
                  <div>
                      <h3 className="font-bold text-gray-800 mb-2">Bio</h3>
                      <textarea 
                        className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-200 text-gray-900" 
                        defaultValue={currentUser.bio}
                        onBlur={(e) => updateUser({...currentUser, bio: e.target.value})}
                      />
                  </div>
                  <div>
                      <h3 className="font-bold text-gray-800 mb-2">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                          {currentUser.interests.map((tag, i) => (
                              <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">{tag}</span>
                          ))}
                          <button className="text-purple-600 text-sm font-semibold hover:bg-purple-50 px-3 py-1 rounded-full transition">+ Add Interest</button>
                      </div>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-xl">
                      <h3 className="font-bold text-blue-800 mb-2">My Order History</h3>
                      {notifications.filter(n => n.type === 'ORDER').length > 0 ? (
                           <div className="space-y-2">
                               {notifications.filter(n => n.type === 'ORDER').map(n => (
                                   <div key={n.id} className="text-sm text-blue-800 border-b border-blue-100 pb-1">{n.message}</div>
                               ))}
                           </div>
                      ) : (
                          <p className="text-blue-600 text-sm">No recent orders found. Time to shop!</p>
                      )}
                  </div>
              </div>
          </div>
      </div>
  );

  const CartDrawer = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const estimatedShipping = cart.reduce((sum, item) => sum + item.shippingCost * item.quantity, 0);

    return (
      <div className={`fixed inset-0 z-[60] flex justify-end transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className={`relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
                                  <p className="text-purple-600 font-bold">${item.price}</p>
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
                      Contact Owner to Buy <Send size={20} />
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-4">We'll connect you directly with {settings.ownerName} to finalize details!</p>
              </div>
          </div>
      </div>
    );
  };

  const CheckoutModal = () => {
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
                        </div>
                        {(!currentUser.address) && <p className="text-xs text-red-500">Please update your address in your profile for delivery!</p>}
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

  const AuthModal = () => {
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

  const OrderConfirmation = () => (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
              <CheckCircle size={48} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-purple-900 mb-2">Order Request Sent!</h2>
          <p className="text-gray-600 max-w-md mb-8">
              Thank you for supporting handmade! We've sent your request to {settings.ownerName}. 
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

  return (
    <div className="min-h-screen bg-fuchsia-50/50 flex flex-col">
      <NavBar />
      <CartDrawer />
      <CheckoutModal />
      <AuthModal />
      
      <div className="flex-1">
        {view === ViewState.LANDING && (
            <>
                <Hero />
                <div className="py-8"><h2 className="text-3xl font-bold text-center text-purple-900 mb-8">Featured Warmth</h2><ProductGrid /></div>
            </>
        )}

        {view === ViewState.SHOP && (
            <div className="py-8">
                <h2 className="text-3xl font-bold text-center text-purple-900 mb-4">Shop All</h2>
                <ProductGrid />
            </div>
        )}

        {view === ViewState.ORDER_CONFIRMATION && <OrderConfirmation />}
        {view === ViewState.PRODUCT_DETAIL && <ProductDetail />}
        {view === ViewState.PROFILE && <Profile />}
      </div>

      <Footer />
    </div>
  );
};