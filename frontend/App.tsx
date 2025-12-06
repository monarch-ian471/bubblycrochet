import React, { useState, useEffect } from 'react';
import { ViewState, Product, UserProfile, CartItem, AdminSettings, Order, Notification, Review } from './types';
import { api, INITIAL_USER } from './services/api';
import { AdminView } from './components/AdminView';
import { ClientView } from './components/ClientView';
import { YarnLogo, FadeIn } from './components/Visuals';
import { ArrowRight, AlertCircle, Loader } from 'lucide-react';

const App: React.FC = () => {
  // --- Global State ---
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<AdminSettings>({
      storeName: '', ownerName: '', logoUrl: '', ownerAvatar: '', primaryColor: '', copyrightText: '', contactEmail: '', contactPhone: '', shopLocation: ''
  });
  
  // Simulated Database State
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // User State
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // --- Auth State ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // --- Initial Data Load ---
  useEffect(() => {
    const loadData = async () => {
        const [p, r, s, o, n] = await Promise.all([
            api.getProducts(),
            api.getReviews(),
            api.getSettings(),
            api.getOrders(),
            api.getNotifications()
        ]);
        setProducts(p);
        setReviews(r);
        setSettings(s);
        setOrders(o);
        setNotifications(n);
    };
    loadData();
  }, []);

  // --- Logic ---

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError(null);
    setIsLoggingIn(true);

    const form = e.target as HTMLFormElement;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const passwordInput = form.elements.namedItem('password') as HTMLInputElement;
    
    try {
      await api.auth.loginAdmin(emailInput.value, passwordInput.value);
      setIsAdmin(true);
      setCurrentView(ViewState.ADMIN_DASHBOARD);
    } catch (err: any) {
      setAdminLoginError(err.message || "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleClientLogin = (email: string, name?: string, address?: string, phone?: string) => {
      // Mock Login/Signup - This would be replaced by api.auth.loginClient in future
      setIsLoggedIn(true);
      setUser({
          ...user,
          email,
          name: name || email.split('@')[0],
          address: address || user.address,
          phone: phone || user.phone
      });
      // Add a welcome notification if it's new
      const welcomeId = Date.now().toString();
      const notif: Notification = {
          id: welcomeId,
          recipientId: email,
          message: `Welcome to ${settings.storeName}, ${name || 'friend'}!`,
          type: 'INFO',
          read: false,
          date: Date.now()
      };
      api.addNotification(notif).then(n => setNotifications(prev => [n, ...prev]));
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handlePlaceOrder = async (items: CartItem[], specialRequest: string) => {
      const orderId = Date.now().toString();
      const shippingTotal = items.reduce((sum, item) => sum + item.shippingCost * item.quantity, 0);
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const newOrder: Order = {
          id: orderId,
          userId: user.email,
          userName: user.name,
          items: [...items],
          totalAmount,
          shippingTotal,
          status: 'PENDING',
          date: Date.now(),
          specialRequest,
          shippingAddress: user.address || 'Address not provided',
          contactEmail: user.email
      };

      await api.createOrder(newOrder);
      setOrders(prev => [newOrder, ...prev]);

      // Notify Admin
      const adminNotif: Notification = {
          id: `notif_admin_${orderId}`,
          recipientId: 'admin',
          message: `New Order #${orderId.slice(-6)} from ${user.name}`,
          type: 'ORDER',
          read: false,
          date: Date.now()
      };
      await api.addNotification(adminNotif);

      // Notify Client
      const clientNotif: Notification = {
          id: `notif_client_${orderId}`,
          recipientId: user.email,
          message: `Order #${orderId.slice(-6)} placed successfully! Status: Pending Review`,
          type: 'ORDER',
          read: false,
          date: Date.now()
      };
      await api.addNotification(clientNotif);
      setNotifications(prev => [adminNotif, clientNotif, ...prev]);

      setCart([]);
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
      await api.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      
      const order = orders.find(o => o.id === orderId);
      if (order) {
           const notif: Notification = {
              id: `notif_update_${Date.now()}`,
              recipientId: order.userId,
              message: `Order #${orderId.slice(-6)} update: ${status}`,
              type: 'ORDER',
              read: false,
              date: Date.now()
          };
          await api.addNotification(notif);
          setNotifications(prev => [notif, ...prev]);
      }
  };

  // --- Review Handling ---
  const handleSubmitReview = async (productId: string, comment: string, rating: number) => {
      if (!isLoggedIn) return;
      
      const newReview: Review = {
          id: Date.now().toString(),
          productId,
          userName: user.name, // Attached from logged in user
          rating,
          comment,
          date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
      };

      await api.addReview(newReview);
      setReviews(prev => [newReview, ...prev]);
  };

  const LoginScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 p-4">
      <FadeIn>
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl max-w-md w-full border border-purple-200 relative overflow-hidden">
          <div className="flex flex-col items-center mb-8 relative z-10">
            <YarnLogo size="lg" animated={true} />
            <h1 className="text-3xl font-bold text-purple-900 mt-6 tracking-tight">Admin Portal</h1>
            <p className="text-gray-500 text-center mt-2">Manage your cozy empire.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-5 relative z-10">
             {adminLoginError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center text-sm">
                    <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                    {adminLoginError}
                </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Admin Email</label>
              <input 
                name="email"
                type="email" 
                placeholder="admin@cozyloops.com" 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition outline-none text-gray-900" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Password</label>
              <input 
                name="password"
                type="password" 
                placeholder="••••••••" 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition outline-none text-gray-900" 
                required
              />
            </div>
            
            <button 
                type="submit" 
                disabled={isLoggingIn}
                className={`w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 transition flex items-center justify-center group ${isLoggingIn ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoggingIn ? <Loader className="animate-spin" /> : (
                  <>
                    Enter Dashboard
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} />
                  </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center relative z-10">
            <button onClick={() => setCurrentView(ViewState.LANDING)} className="text-sm text-gray-400 hover:text-purple-500 transition underline">
               &larr; Return to Store
            </button>
          </div>
        </div>
      </FadeIn>
    </div>
  );

  // --- Render Router ---
  if (currentView === ViewState.LOGIN) {
    return <LoginScreen />;
  }

  if (isAdmin && currentView !== ViewState.LANDING) {
    return (
      <AdminView 
        products={products} 
        setProducts={setProducts} 
        settings={settings}
        setSettings={(s) => {
            api.updateSettings(s);
            setSettings(s);
        }}
        orders={orders}
        updateOrder={updateOrderStatus}
        notifications={notifications.filter(n => n.recipientId === 'admin')}
        onLogout={() => { setIsAdmin(false); setCurrentView(ViewState.LANDING); }}
      />
    );
  }

  return (
    <ClientView 
      products={products}
      reviews={reviews}
      settings={settings}
      currentUser={user}
      cart={cart}
      addToCart={handleAddToCart}
      updateUser={setUser}
      onNavigate={(view) => {
        if (view === ViewState.LOGIN) {
           setCurrentView(ViewState.LOGIN);
        }
      }}
      notifications={notifications.filter(n => n.recipientId === user.email)}
      isLoggedIn={isLoggedIn}
      onLogin={handleClientLogin}
      onPlaceOrder={handlePlaceOrder}
      onSubmitReview={handleSubmitReview}
    />
  );
};

export default App;