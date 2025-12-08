import React, { useState, useEffect } from 'react';
import { Product, AdminSettings, Order, Notification, Review, JourneySection } from './src/types/types';
import { api } from './src/services/api';
import { AdminView } from './src/components/AdminView';
import { YarnLogo, FadeIn } from './src/components/Visuals';
import { ArrowRight, AlertCircle, Loader } from 'lucide-react';

const Admin: React.FC = () => {
  // --- State ---
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<AdminSettings>({
      storeName: '', ownerName: '', logoUrl: '', ownerAvatar: '', primaryColor: '', copyrightText: '', contactEmail: '', contactPhone: '', shopLocation: ''
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [journeyData, setJourneyData] = useState<JourneySection>({
    styles: [],
    tools: [],
    resources: [],
    stores: []
  });
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // --- Initial Data Load ---
  useEffect(() => {
    const loadData = async () => {
        const [p, s, o, n, j] = await Promise.all([
            api.getProducts(),
            api.getSettings(),
            api.getOrders(),
            api.getNotifications(),
            api.getJourneyResources()
        ]);
        setProducts(p);
        setSettings(s);
        setOrders(o);
        setNotifications(n);
        setJourneyData(j);
    };
    loadData();
  }, []);

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
    } catch (err: any) {
      setAdminLoginError(err.message || "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
      await api.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      
      const order = orders.find(o => o.id === orderId);
      if (order) {
           // Notification for client
           const clientNotif: Notification = {
              id: `notif_update_${Date.now()}`,
              recipientId: order.userId,
              message: `Order #${orderId.slice(-6)} update: ${status}`,
              type: 'ORDER',
              read: false,
              date: Date.now()
          };
          await api.addNotification(clientNotif);
          
          // Notification for admin
          const adminNotif: Notification = {
              id: `admin_notif_${Date.now()}`,
              recipientId: 'admin',
              message: `You updated order #${orderId.slice(-6)} to ${status}`,
              type: 'ORDER',
              read: false,
              date: Date.now()
          };
          await api.addNotification(adminNotif);
          setNotifications(prev => [adminNotif, clientNotif, ...prev]);
      }
  };

  const LoginScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 p-4">
      <FadeIn>
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl max-w-md w-full border border-purple-200 relative overflow-hidden">
          <div className="flex flex-col items-center mb-8 relative z-10">
            <YarnLogo size="lg" animated={true} />
            <h1 className="text-3xl font-bold text-purple-900 mt-6 tracking-tight">Admin Portal</h1>
            <p className="text-gray-500 text-center mt-2">Manage your crochet collection.</p>
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
                placeholder="admin@bubblycrochet.com" 
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
            <a href="/" className="text-sm text-gray-400 hover:text-purple-500 transition underline">
               &larr; Return to Collection
            </a>
          </div>
        </div>
      </FadeIn>
    </div>
  );

  if (!isAdmin) {
    return <LoginScreen />;
  }

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
      onLogout={() => setIsAdmin(false)}
      journeyData={journeyData}
      setJourneyData={setJourneyData}
    />
  );
};

export default Admin;
