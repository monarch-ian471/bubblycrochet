import React, { useState, useEffect } from 'react';
import { ViewState, Product, UserProfile, CartItem, AdminSettings, Order, Notification, Review } from './src/types/types';
import { api, INITIAL_USER } from './src/services/api';
import { AdminView } from './src/components/AdminView';
import { ClientView } from './src/components/ClientView';
import { YarnLogo, FadeIn } from './src/components/Visuals';
import { ArrowRight, AlertCircle, Loader } from 'lucide-react';

const App: React.FC = () => {
  // --- Global State ---
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

  const handleClientLogin = (email: string, name?: string, address?: string, phone?: string, country?: string, countryCode?: string) => {
      // Mock Login/Signup - This would be replaced by api.auth.loginClient in future
      setIsLoggedIn(true);
      setUser({
          ...user,
          email,
          name: name || email.split('@')[0],
          address: address || user.address,
          phone: phone || user.phone,
          country: country || user.country,
          countryCode: countryCode || user.countryCode
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
      
      // Calculate with discounts
      const getItemPrice = (item: CartItem) => {
        if (item.discount && item.discount > 0) {
          return item.price * (1 - item.discount / 100);
        }
        return item.price;
      };
      
      const shippingTotal = items.reduce((sum, item) => sum + item.shippingCost * item.quantity, 0);
      const totalAmount = items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);

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
      
      // Notify Admin about new review
      const product = products.find(p => p.id === productId);
      const adminNotif: Notification = {
          id: `admin_review_${Date.now()}`,
          recipientId: 'admin',
          message: `New ${rating}★ review on "${product?.name || 'product'}" by ${user.name}`,
          type: 'ORDER',
          read: false,
          date: Date.now()
      };
      await api.addNotification(adminNotif);
  };

  // --- Account Deletion ---
  const handleDeleteAccount = async () => {
      if (!isLoggedIn) return;
      
      await api.deleteUser(user.email);
      // Reset user state
      setIsLoggedIn(false);
      setUser(INITIAL_USER);
      setCart([]);
      setNotifications(prev => prev.filter(n => n.recipientId !== user.email));
  };

  // --- Render Router ---
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
        // Navigation handled within ClientView
      }}
      notifications={notifications.filter(n => n.recipientId === user.email)}
      isLoggedIn={isLoggedIn}
      onLogin={handleClientLogin}
      onPlaceOrder={handlePlaceOrder}
      onSubmitReview={handleSubmitReview}
      onDeleteAccount={handleDeleteAccount}
    />
  );
};

export default App;