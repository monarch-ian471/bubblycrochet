import React, { useState } from 'react';
import { Product, AdminSettings, Order, Notification, JourneySection, JourneyResource } from '../types/types';
import { Sidebar } from './admin/Sidebar';
import { Dashboard } from './admin/Dashboard';
import { ProductsManagement } from './admin/ProductsManagement';
import { OrdersManagement } from './admin/OrdersManagement';
import { SettingsManagement } from './admin/SettingsManagement';
import { JourneyManagement } from './admin/JourneyManagement';
import { api } from '../services/api';
import { Check, AlertCircle } from 'lucide-react';

interface AdminViewProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  settings: AdminSettings;
  setSettings: (s: AdminSettings) => void;
  orders: Order[];
  updateOrder: (orderId: string, status: Order['status']) => void;
  notifications: Notification[];
  onLogout: () => void;
  journeyData: JourneySection;
  setJourneyData: React.Dispatch<React.SetStateAction<JourneySection>>;
}

export const AdminView: React.FC<AdminViewProps> = ({ 
    products, setProducts, settings, setSettings, orders, updateOrder, notifications, onLogout, journeyData, setJourneyData
}) => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PRODUCTS' | 'ORDERS' | 'SETTINGS' | 'JOURNEY'>('DASHBOARD');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const unreadOrdersCount = notifications.filter(n => n.type === 'ORDER' && !n.read).length;

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Handlers ---
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(id);
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast('Product deleted successfully', 'success');
      } catch (error) {
        showToast('Failed to delete product', 'error');
        console.error(error);
      }
    }
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newProduct: Product = {
      id: editingProduct?.id || '',
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      images: [formData.get('imageUrl') as string || 'https://picsum.photos/600/600'],
      inStock: formData.get('inStock') === 'true',
      createdAt: editingProduct ? editingProduct.createdAt : Date.now(),
      discount: parseFloat(formData.get('discount') as string) || 0,
      daysToMake: parseInt(formData.get('daysToMake') as string) || 3,
      shippingCost: parseFloat(formData.get('shippingCost') as string) || 0,
    };

    try {
      const savedProduct = await api.saveProduct(newProduct);
      
      if (editingProduct?.id) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? savedProduct : p));
        showToast('Product updated successfully', 'success');
      } else {
        setProducts(prev => [savedProduct, ...prev]);
        showToast('Product added successfully', 'success');
      }
      setEditingProduct(null);
    } catch (error) {
      showToast('Failed to save product', 'error');
      console.error(error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await api.updateSettings(settings);
      showToast('Settings saved successfully', 'success');
    } catch (error) {
      showToast('Failed to save settings', 'error');
      console.error(error);
    }
  };

  const handleSaveJourneyResource = async (resource: JourneyResource) => {
    try {
      if (resource.id && resource.id.startsWith('journey_')) {
        // New resource - create
        const created = await api.createJourneyResource({
          title: resource.title,
          description: resource.description,
          url: resource.url,
          thumbnailUrl: resource.thumbnailUrl,
          category: resource.category
        });
        
        setJourneyData(prev => ({
          ...prev,
          [resource.category]: [...prev[resource.category], created]
        }));
      } else if (resource.id) {
        // Existing resource - update
        const updated = await api.updateJourneyResource(resource.id, {
          title: resource.title,
          description: resource.description,
          url: resource.url,
          thumbnailUrl: resource.thumbnailUrl,
          category: resource.category
        });
        
        setJourneyData(prev => {
          const category = resource.category;
          return {
            ...prev,
            [category]: prev[category].map(r => r.id === resource.id ? updated : r)
          };
        });
      }
      showToast('Journey resource saved successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to save journey resource', 'error');
      console.error(error);
    }
  };

  const handleDeleteJourneyResource = async (id: string, category: string) => {
    try {
      await api.deleteJourneyResource(id);
      setJourneyData(prev => ({
        ...prev,
        [category]: prev[category as keyof JourneySection].filter(r => r.id !== id)
      }));
      showToast('Journey resource deleted successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to delete journey resource', 'error');
      console.error(error);
    }
  };

  return (
    <>
      {toast && (
        <div className={`fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <Check size={24} /> : <AlertCircle size={24} />}
          <span className="font-semibold">{toast.message}</span>
        </div>
      )}
      <div className="flex h-screen bg-fuchsia-50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
        unreadOrdersCount={unreadOrdersCount}
        logoUrl={settings.logoUrl}
        storeName={settings.storeName}
        notifications={notifications}
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
            onSave={handleSaveSettings}
          />
        )}
        {activeTab === 'JOURNEY' && (
          <JourneyManagement
            journeyData={journeyData}
            onSaveResource={handleSaveJourneyResource}
            onDeleteResource={handleDeleteJourneyResource}
          />
        )}
      </main>
    </div>
    </>
  );
};
