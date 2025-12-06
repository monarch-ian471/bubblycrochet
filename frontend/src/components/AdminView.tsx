import React, { useState } from 'react';
import { Product, AdminSettings, Order, Notification } from '../types';
import { Sidebar } from './admin/Sidebar';
import { Dashboard } from './admin/Dashboard';
import { ProductsManagement } from './admin/ProductsManagement';
import { OrdersManagement } from './admin/OrdersManagement';
import { SettingsManagement } from './admin/SettingsManagement';

interface AdminViewProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  settings: AdminSettings;
  setSettings: (s: AdminSettings) => void;
  orders: Order[];
  updateOrder: (orderId: string, status: Order['status']) => void;
  notifications: Notification[];
  onLogout: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ 
    products, setProducts, settings, setSettings, orders, updateOrder, notifications, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PRODUCTS' | 'ORDERS' | 'SETTINGS'>('DASHBOARD');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const unreadOrdersCount = notifications.filter(n => n.type === 'ORDER' && !n.read).length;

  // --- Handlers ---
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      images: [formData.get('imageUrl') as string || 'https://picsum.photos/600/600'],
      inStock: true,
      createdAt: editingProduct ? editingProduct.createdAt : Date.now(),
      discount: parseFloat(formData.get('discount') as string) || 0,
      daysToMake: parseInt(formData.get('daysToMake') as string) || 3,
      shippingCost: parseFloat(formData.get('shippingCost') as string) || 0,
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? newProduct : p));
    } else {
      setProducts(prev => [newProduct, ...prev]);
    }
    setEditingProduct(null);
  };

  return (
    <div className="flex h-screen bg-fuchsia-50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
        unreadOrdersCount={unreadOrdersCount}
      />

      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'DASHBOARD' && (
          <Dashboard 
            products={products}
            orders={orders}
            unreadOrdersCount={unreadOrdersCount}
          />
        )}
        {activeTab === 'PRODUCTS' && (
          <ProductsManagement 
            products={products}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            handleDelete={handleDelete}
            handleSaveProduct={handleSaveProduct}
          />
        )}
        {activeTab === 'ORDERS' && (
          <OrdersManagement 
            orders={orders}
            updateOrder={updateOrder}
          />
        )}
        {activeTab === 'SETTINGS' && (
          <SettingsManagement 
            settings={settings}
            setSettings={setSettings}
          />
        )}
      </main>
    </div>
  );
};
