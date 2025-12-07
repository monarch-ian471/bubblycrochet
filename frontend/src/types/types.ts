export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  createdAt: number;
  discount?: number; // Percentage
  inStock: boolean;
  daysToMake: number;
  shippingCost: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface UserProfile {
  name: string;
  bio: string;
  interests: string[];
  avatar: string;
  email: string;
  address?: string;
  phone?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  countryCode?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  totalAmount: number;
  shippingTotal: number;
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'COMPLETED';
  date: number;
  specialRequest?: string;
  shippingAddress: string;
  contactEmail: string;
}

export interface Notification {
  id: string;
  recipientId: string; // 'admin' or userId
  message: string;
  type: 'ORDER' | 'SYSTEM' | 'INFO';
  read: boolean;
  date: number;
}

export interface AdminSettings {
  storeName: string;
  ownerName: string;
  logoUrl: string;
  ownerAvatar: string;
  primaryColor: string;
  copyrightText: string;
  contactEmail: string;
  contactPhone: string;
  shopLocation: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
}

export interface JourneyResource {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  category: 'styles' | 'tools' | 'resources' | 'stores';
  createdAt: number;
}

export interface JourneySection {
  styles: JourneyResource[];
  tools: JourneyResource[];
  resources: JourneyResource[];
  stores: JourneyResource[];
}

export enum ViewState {
  LANDING = 'LANDING',
  SHOP = 'SHOP',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  CART = 'CART',
  PROFILE = 'PROFILE',
  LOGIN = 'LOGIN',
  ORDER_CONFIRMATION = 'ORDER_CONFIRMATION',
  JOURNEY = 'JOURNEY',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  ADMIN_PRODUCTS = 'ADMIN_PRODUCTS',
  ADMIN_ORDERS = 'ADMIN_ORDERS',
  ADMIN_SETTINGS = 'ADMIN_SETTINGS'
}