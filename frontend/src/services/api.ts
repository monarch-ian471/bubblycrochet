import { Product, Review, AdminSettings, UserProfile, Order, Notification } from '../types/types';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// --- IN-MEMORY DATABASE (Replace these with MongoDB calls in the future) ---
let PRODUCTS_DB: Product[] = [
  {
    id: '1',
    name: 'Lavender Granny Square Blanket',
    description: 'A cozy, hand-stitched blanket perfect for chilly evenings. Made with premium soft acrylic yarn in shades of purple and cream.',
    price: 120,
    images: ['https://picsum.photos/600/600?random=1', 'https://picsum.photos/600/600?random=101'],
    category: 'Blankets',
    createdAt: Date.now() - 10000000,
    inStock: true,
    discount: 10,
    daysToMake: 14,
    shippingCost: 15
  },
  {
    id: '2',
    name: 'Amigurumi Turtle Plush',
    description: 'Adorable handmade turtle plushie. Safe for kids and extremely soft. A perfect gift for grandchildren.',
    price: 45,
    images: ['https://picsum.photos/600/600?random=2'],
    category: 'Toys',
    createdAt: Date.now() - 5000000,
    inStock: true,
    daysToMake: 3,
    shippingCost: 8
  },
  {
    id: '3',
    name: 'Boho Market Bag',
    description: 'Eco-friendly cotton market bag. Durable, washable, and stylish for your grocery runs.',
    price: 35,
    images: ['https://picsum.photos/600/600?random=3'],
    category: 'Accessories',
    createdAt: Date.now(),
    inStock: true,
    daysToMake: 5,
    shippingCost: 5
  },
  {
    id: '4',
    name: 'Winter Scarf & Beanie Set',
    description: 'Matching set in a deep rose color. Keeps you warm and looks fashionable.',
    price: 60,
    images: ['https://picsum.photos/600/600?random=4'],
    category: 'Apparel',
    createdAt: Date.now(),
    inStock: true,
    daysToMake: 7,
    shippingCost: 10
  }
];

let REVIEWS_DB: Review[] = [
  {
    id: 'r1',
    productId: '1',
    userName: 'Martha S.',
    rating: 5,
    comment: 'Absolutely beautiful work. The colors are even more vibrant in person!',
    date: '2023-10-15'
  },
  {
    id: 'r2',
    productId: '2',
    userName: 'Jessica K.',
    rating: 5,
    comment: 'My daughter loves her new turtle. Thank you!',
    date: '2023-11-02'
  }
];

let SETTINGS_DB: AdminSettings = {
  storeName: 'Bubbly Crochet',
  ownerName: 'Kerrina Nkhoma',
  logoUrl: 'src/assets/bubblycrochetlogo.png',
  ownerAvatar: 'src/assets/kerrinankhoma.jpeg',
  primaryColor: '#d946ef',
  copyrightText: '© 2025 Bubbly Crochet. All rights reserved.',
  contactEmail: 'kerrinankhoma@gmail.com',
  contactPhone: '+1 (555) 123-4567',
  shopLocation: 'Seattle, WA',
  instagramUrl: 'https://instagram.com',
  tiktokUrl: 'https://tiktok.com',
  youtubeUrl: ''
};

let ORDERS_DB: Order[] = [];
let NOTIFICATIONS_DB: Notification[] = [];

// --- API SERVICE ---
// When integrating MongoDB, replace the logic inside these functions with your DB calls.

export const api = {
  // --- AUTHENTICATION & VALIDATION ---
  auth: {
    // Client Registration
    register: async (userData: {
      email: string;
      password: string;
      name: string;
      address: string;
      country: string;
      countryCode: string;
      phone: string;
    }): Promise<{ success: boolean; message?: string }> => {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
        if (response.data.success) {
          return { success: true };
        }
        return { success: false, message: 'Registration failed' };
      } catch (error: any) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Registration failed' 
        };
      }
    },

    // Client Login
    loginClient: async (email: string, password: string): Promise<{ token: string; user: any }> => {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email,
          password
        });
        
        if (response.data.success && response.data.token) {
          localStorage.setItem('token', response.data.token);
          return response.data;
        }
        throw new Error('Login failed');
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Invalid credentials');
      }
    },

    // Admin Login
    loginAdmin: async (email: string, password: string): Promise<boolean> => {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/admin/login', {
          email,
          password,
        });
        
        if (response.data.success && response.data.token) {
          localStorage.setItem('adminToken', response.data.token);
          return true;
        }
        return false;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || "Invalid admin credentials");
      }
    },

    // Client Validation (Pre-check before sending to DB)
    validateClientPayload: (email: string, password: string): string | null => {
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       if (!email || !emailRegex.test(email)) {
         return "Please enter a valid email address.";
       }
       if (!password || password.length < 6) {
         return "Password must be at least 6 characters long.";
       }
       return null; // No error
    },

    // Change Password
    changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
        const response = await axios.put(`${API_BASE_URL}/auth/change-password`, 
          { currentPassword, newPassword },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return { success: true };
      } catch (error: any) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Failed to change password' 
        };
      }
    },

    // Reset Password Request
    requestPasswordReset: async (email: string): Promise<{ success: boolean; message?: string }> => {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/reset-password-request`, { email });
        return { success: true, message: response.data.message };
      } catch (error: any) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Failed to send reset email' 
        };
      }
    }
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      return response.data.products || [];
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  },
  saveProduct: async (product: Product): Promise<Product> => {
    const token = localStorage.getItem('adminToken');
    const productData = {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images,
      inStock: product.inStock,
      discount: product.discount,
      daysToMake: product.daysToMake,
      shippingCost: product.shippingCost
    };
    
    if (product.id && product.id !== '') {
      // Update existing product
      const response = await axios.put(`${API_BASE_URL}/products/${product.id}`, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.product;
    } else {
      // Create new product
      const response = await axios.post(`${API_BASE_URL}/products`, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.product;
    }
  },
  deleteProduct: async (id: string): Promise<void> => {
    const token = localStorage.getItem('adminToken');
    await axios.delete(`${API_BASE_URL}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Reviews
  getReviews: async (): Promise<Review[]> => {
    return Promise.resolve([...REVIEWS_DB]);
  },
  addReview: async (review: Review): Promise<Review> => {
    // MongoDB: return await axios.post('/api/reviews', review);
    REVIEWS_DB.unshift(review);
    return Promise.resolve(review);
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.orders || [];
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      return [];
    }
  },
  createOrder: async (order: Order): Promise<Order> => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/orders`, order, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.order;
  },
  updateOrderStatus: async (id: string, status: Order['status']): Promise<void> => {
    const token = localStorage.getItem('adminToken');
    await axios.put(`${API_BASE_URL}/orders/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Settings
  getSettings: async (): Promise<AdminSettings> => {
    return Promise.resolve({ ...SETTINGS_DB });
  },
  updateSettings: async (settings: AdminSettings): Promise<AdminSettings> => {
    SETTINGS_DB = settings;
    return Promise.resolve(settings);
  },

  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    return Promise.resolve([...NOTIFICATIONS_DB]);
  },
  addNotification: async (notification: Notification): Promise<Notification> => {
    NOTIFICATIONS_DB.unshift(notification);
    return Promise.resolve(notification);
  },

  // User Management
  deleteUser: async (email: string): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/auth/account`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Clear local token after successful deletion
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      
      // Also update local mock data for consistency
      ORDERS_DB = ORDERS_DB.filter(o => o.userId !== email);
      NOTIFICATIONS_DB = NOTIFICATIONS_DB.filter(n => n.recipientId !== email);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete account');
    }
  }
};

export const INITIAL_USER: UserProfile = {
  name: 'Guest User',
  bio: 'I love finding unique handmade items.',
  interests: ['Blankets', 'Scarves'],
  avatar: 'https://picsum.photos/200/200?random=50',
  email: 'guest@example.com'
};