import { Product, Review, AdminSettings, UserProfile, Order, Notification } from '../types';

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
  storeName: 'CozyLoops',
  ownerName: 'Grandma Alice',
  logoUrl: 'https://picsum.photos/100/100?random=99',
  ownerAvatar: 'https://picsum.photos/200/200?random=88',
  primaryColor: '#d946ef',
  copyrightText: '© 2025 CozyLoops. All rights reserved.',
  contactEmail: 'alice@cozyloops.com',
  contactPhone: '+1 (555) 123-4567',
  shopLocation: 'Portland, OR',
  instagramUrl: 'https://instagram.com',
  tiktokUrl: 'https://tiktok.com',
  youtubeUrl: ''
};

let ORDERS_DB: Order[] = [];
let NOTIFICATIONS_DB: Notification[] = [];

// --- API SERVICE ---
// When integrating MongoDB, replace the logic inside these functions with your DB calls.

export const api = {
  // Products
  getProducts: async (): Promise<Product[]> => {
    // MongoDB: return await axios.get('/api/products');
    return new Promise((resolve) => setTimeout(() => resolve([...PRODUCTS_DB]), 300));
  },
  saveProduct: async (product: Product): Promise<Product> => {
    // MongoDB: return await axios.post('/api/products', product);
    const index = PRODUCTS_DB.findIndex(p => p.id === product.id);
    if (index >= 0) {
      PRODUCTS_DB[index] = product;
    } else {
      PRODUCTS_DB.unshift(product);
    }
    return Promise.resolve(product);
  },
  deleteProduct: async (id: string): Promise<void> => {
     PRODUCTS_DB = PRODUCTS_DB.filter(p => p.id !== id);
     return Promise.resolve();
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
    return Promise.resolve([...ORDERS_DB]);
  },
  createOrder: async (order: Order): Promise<Order> => {
    ORDERS_DB.unshift(order);
    return Promise.resolve(order);
  },
  updateOrderStatus: async (id: string, status: Order['status']): Promise<void> => {
    const order = ORDERS_DB.find(o => o.id === id);
    if (order) order.status = status;
    return Promise.resolve();
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
  }
};

export const INITIAL_USER: UserProfile = {
  name: 'Guest User',
  bio: 'I love finding unique handmade items.',
  interests: ['Blankets', 'Scarves'],
  avatar: 'https://picsum.photos/200/200?random=50',
  email: 'guest@example.com'
};