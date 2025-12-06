import React, { useState } from 'react';
import { Product, AdminSettings, Order, Notification } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Settings, Package, LayoutDashboard, Trash2, Edit2, TrendingUp, Save, DollarSign, Image as ImageIcon, ShoppingCart, Bell, CheckCircle, Clock, Instagram, Youtube, Video } from 'lucide-react';
import { MatrixVis } from './Visuals';

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
      setProducts(prev => prev.map(p => p.id === p.id ? newProduct : p));
    } else {
      setProducts(prev => [newProduct, ...prev]);
    }
    setEditingProduct(null); // Close modal/form mode
  };

  const renderDashboard = () => {
    const data = [
        { name: 'Mon', visits: 400, sales: 24 },
        { name: 'Tue', visits: 300, sales: 13 },
        { name: 'Wed', visits: 500, sales: 98 },
        { name: 'Thu', visits: 280, sales: 39 },
        { name: 'Fri', visits: 590, sales: 48 },
        { name: 'Sat', visits: 800, sales: 120 },
        { name: 'Sun', visits: 700, sales: 110 },
    ];

    const unreadOrders = notifications.filter(n => n.type === 'ORDER' && !n.read).length;

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-purple-900">Dashboard Overview</h2>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100 flex items-center space-x-4">
             <div className="p-3 bg-pink-100 text-pink-600 rounded-full"><Package /></div>
             <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-800">{products.length}</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100 flex items-center space-x-4">
             <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><TrendingUp /></div>
             <div>
                <p className="text-sm text-gray-500">Total Visits</p>
                <p className="text-2xl font-bold text-gray-800">3,429</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100 flex items-center space-x-4">
             <div className="p-3 bg-green-100 text-green-600 rounded-full"><DollarSign /></div>
             <div>
                <p className="text-sm text-gray-500">Revenue (Est)</p>
                <p className="text-2xl font-bold text-gray-800">$1,250</p>
             </div>
          </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100 flex items-center space-x-4 relative">
             <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><ShoppingCart /></div>
             <div>
                <p className="text-sm text-gray-500">New Orders</p>
                <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
             </div>
             {unreadOrders > 0 && <span className="absolute top-4 right-4 bg-red-500 w-3 h-3 rounded-full animate-ping"></span>}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100 h-96">
                <h3 className="text-purple-900 font-semibold mb-4">Weekly Engagement</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0abfc" vertical={false} />
                        <XAxis dataKey="name" stroke="#86198f" />
                        <YAxis stroke="#86198f" />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} cursor={{fill: '#fce7f3'}} />
                        <Bar dataKey="visits" fill="#d946ef" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="sales" fill="#7e22ce" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            {/* The Matrix D3 Aspect */}
            <MatrixVis dataPoints={products.length * 5 + orders.length * 10} />
        </div>
      </div>
    );
  };

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-900">Product Management</h2>
        <button 
          onClick={() => setEditingProduct({ id: '', name: '', description: '', price: 0, images: [''], category: '', createdAt: 0, inStock: true, daysToMake: 3, shippingCost: 0 } as Product)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-700 transition"
        >
          <Plus size={18} className="mr-2" /> Add New
        </button>
      </div>

      {editingProduct && (
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-100 mb-6 animate-in slide-in-from-top-4">
            <h3 className="text-lg font-bold text-purple-800 mb-4">{editingProduct.id ? 'Edit Product' : 'New Product'}</h3>
            <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input name="name" defaultValue={editingProduct.name} required className="w-full mt-1 p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select name="category" defaultValue={editingProduct.category} className="w-full mt-1 p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900">
                            <option>Blankets</option>
                            <option>Toys</option>
                            <option>Apparel</option>
                            <option>Accessories</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                        <input name="price" type="number" step="0.01" defaultValue={editingProduct.price} required className="w-full mt-1 p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                        <input name="discount" type="number" defaultValue={editingProduct.discount || 0} className="w-full mt-1 p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Shipping Cost ($)</label>
                        <input name="shippingCost" type="number" step="0.01" defaultValue={editingProduct.shippingCost || 0} className="w-full mt-1 p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Production Time (Days)</label>
                        <input name="daysToMake" type="number" defaultValue={editingProduct.daysToMake || 3} className="w-full mt-1 p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" defaultValue={editingProduct.description} rows={3} className="w-full mt-1 p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <div className="flex space-x-2">
                        <input name="imageUrl" defaultValue={editingProduct.images[0]} className="w-full mt-1 p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900" placeholder="https://..." />
                        <button type="button" className="mt-1 p-2 bg-gray-100 rounded-lg text-gray-600"><ImageIcon size={20}/></button>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t border-purple-50">
                    <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center">
                        <Save size={18} className="mr-2" /> Save Product
                    </button>
                </div>
            </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-pink-100 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-pink-50 text-purple-900 font-semibold">
                <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Shipping</th>
                    <th className="p-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
                {products.map(product => (
                    <tr key={product.id} className="hover:bg-pink-50/50 transition">
                        <td className="p-4 flex items-center space-x-3">
                            <img src={product.images[0]} alt="" className="w-10 h-10 rounded-md object-cover bg-gray-200" />
                            <span className="font-medium text-gray-800">{product.name}</span>
                        </td>
                        <td className="p-4 text-gray-600">{product.category}</td>
                        <td className="p-4 text-gray-800">${product.price.toFixed(2)}</td>
                        <td className="p-4 text-gray-600">${product.shippingCost}</td>
                        <td className="p-4 text-right space-x-2">
                            <button onClick={() => setEditingProduct(product)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-full"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full"><Trash2 size={16} /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-purple-900">Orders & Reviews</h2>
       <div className="bg-white rounded-xl shadow-sm border border-pink-100 overflow-hidden">
          {orders.length === 0 ? (
             <div className="p-12 text-center text-gray-400">No orders yet.</div>
          ) : (
            <div className="divide-y divide-pink-50">
                {orders.map(order => (
                    <div key={order.id} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-purple-900">Order #{order.id.slice(-6)}</h3>
                                <p className="text-sm text-gray-500">From: <span className="font-medium text-gray-800">{order.userName}</span></p>
                                <p className="text-sm text-gray-500">Date: {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex flex-col items-end">
                                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : order.status === 'REVIEWED' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {order.status}
                                 </span>
                                 <span className="font-bold text-xl mt-2 text-gray-800">${(order.totalAmount + order.shippingTotal).toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                             <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Items</h4>
                             {order.items.map(item => (
                                 <div key={item.id} className="flex justify-between text-sm mb-1">
                                    <span>{item.quantity}x {item.name}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                 </div>
                             ))}
                             <div className="flex justify-between text-sm mt-2 pt-2 border-t border-gray-200 font-bold">
                                <span>Shipping</span>
                                <span>${order.shippingTotal.toFixed(2)}</span>
                             </div>
                        </div>
                         <div className="bg-purple-50 p-4 rounded-lg mb-4">
                             <h4 className="text-xs font-bold text-purple-500 uppercase mb-1">Client Special Request</h4>
                             <p className="text-sm text-gray-700 italic">"{order.specialRequest || 'None'}"</p>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg mb-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Shipping Details</h4>
                            <p className="text-sm text-gray-700">{order.shippingAddress}</p>
                             <p className="text-sm text-gray-700 mt-1">Contact: {order.contactEmail}</p>
                        </div>
                        
                        <div className="flex gap-2 justify-end">
                            {order.status === 'PENDING' && (
                                <button onClick={() => updateOrder(order.id, 'REVIEWED')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">Mark as Reviewed</button>
                            )}
                            {order.status === 'REVIEWED' && (
                                <button onClick={() => updateOrder(order.id, 'ACCEPTED')} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700">Accept Order</button>
                            )}
                             {(order.status === 'ACCEPTED' || order.status === 'REVIEWED') && (
                                <button onClick={() => updateOrder(order.id, 'COMPLETED')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">Complete & Ship</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
          )}
       </div>
    </div>
  );

  const renderSettings = () => (
      <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-purple-900">Store Settings</h2>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-pink-100 space-y-6">
            <div className="flex items-center space-x-6">
                <div className="relative group cursor-pointer">
                    <img src={settings.logoUrl} alt="Logo" className="w-24 h-24 rounded-full border-4 border-pink-100" />
                    <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <Edit2 className="text-white" />
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-800">Store Branding</h3>
                    <p className="text-sm text-gray-500">Update your store identity</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Store Name</label>
                        <input value={settings.storeName} onChange={(e) => setSettings({...settings, storeName: e.target.value})} className="w-full mt-1 p-3 border border-purple-200 rounded-lg text-gray-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                        <input value={settings.ownerName} onChange={(e) => setSettings({...settings, ownerName: e.target.value})} className="w-full mt-1 p-3 border border-purple-200 rounded-lg text-gray-900" />
                    </div>
                </div>
                <div>
                     <h3 className="font-bold text-gray-800 mt-4 mb-2">Admin Full Info & Contact</h3>
                     <p className="text-xs text-red-500 mb-2">* Visible to clients only during checkout</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                        <input value={settings.contactEmail} onChange={(e) => setSettings({...settings, contactEmail: e.target.value})} className="w-full mt-1 p-3 border border-purple-200 rounded-lg text-gray-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                        <input value={settings.contactPhone} onChange={(e) => setSettings({...settings, contactPhone: e.target.value})} className="w-full mt-1 p-3 border border-purple-200 rounded-lg text-gray-900" />
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Shop Location / Address</label>
                    <input value={settings.shopLocation} onChange={(e) => setSettings({...settings, shopLocation: e.target.value})} className="w-full mt-1 p-3 border border-purple-200 rounded-lg text-gray-900" />
                </div>
                
                 <div>
                     <h3 className="font-bold text-gray-800 mt-4 mb-2">Social Media Links</h3>
                </div>
                 <div className="space-y-3">
                     <div className="flex items-center gap-2">
                        <Instagram size={20} className="text-pink-600"/>
                        <input placeholder="Instagram URL" value={settings.instagramUrl || ''} onChange={(e) => setSettings({...settings, instagramUrl: e.target.value})} className="w-full p-3 border border-purple-200 rounded-lg text-gray-900" />
                    </div>
                     <div className="flex items-center gap-2">
                         {/* Using Video icon as placeholder for TikTok if specific icon not available */}
                        <div className="relative">
                             <div className="w-5 h-5 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full leading-none">T</div>
                        </div>
                        <input placeholder="TikTok URL" value={settings.tiktokUrl || ''} onChange={(e) => setSettings({...settings, tiktokUrl: e.target.value})} className="w-full p-3 border border-purple-200 rounded-lg text-gray-900" />
                    </div>
                     <div className="flex items-center gap-2">
                        <Youtube size={20} className="text-red-600"/>
                        <input placeholder="YouTube URL" value={settings.youtubeUrl || ''} onChange={(e) => setSettings({...settings, youtubeUrl: e.target.value})} className="w-full p-3 border border-purple-200 rounded-lg text-gray-900" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mt-4">Copyright Text</label>
                    <input value={settings.copyrightText} onChange={(e) => setSettings({...settings, copyrightText: e.target.value})} className="w-full mt-1 p-3 border border-purple-200 rounded-lg text-gray-900" />
                </div>
                <button className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold shadow-lg shadow-purple-200 transition">Save Changes</button>
            </div>
          </div>
      </div>
  );

  return (
    <div className="flex h-screen bg-fuchsia-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-pink-100 flex flex-col shadow-lg z-10">
        <div className="p-6 border-b border-pink-50">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-50 flex items-center gap-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                Admin
            </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            <button 
                onClick={() => setActiveTab('DASHBOARD')}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'DASHBOARD' ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <LayoutDashboard size={20} /> <span>Dashboard</span>
            </button>
            <button 
                onClick={() => setActiveTab('PRODUCTS')}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'PRODUCTS' ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <Package size={20} /> <span>Products</span>
            </button>
             <button 
                onClick={() => setActiveTab('ORDERS')}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'ORDERS' ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <div className="relative">
                    <ShoppingCart size={20} />
                    {notifications.filter(n => n.type === 'ORDER' && !n.read).length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 w-2 h-2 rounded-full"></span>}
                </div> 
                <span>Orders</span>
            </button>
            <button 
                onClick={() => setActiveTab('SETTINGS')}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${activeTab === 'SETTINGS' ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <Settings size={20} /> <span>Settings</span>
            </button>
        </nav>
        <div className="p-4 border-t border-pink-50">
            <button onClick={onLogout} className="w-full flex items-center space-x-2 text-red-500 p-2 hover:bg-red-50 rounded-lg transition">
                <span>Sign Out</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'DASHBOARD' && renderDashboard()}
        {activeTab === 'PRODUCTS' && renderProducts()}
        {activeTab === 'ORDERS' && renderOrders()}
        {activeTab === 'SETTINGS' && renderSettings()}
      </main>
    </div>
  );
};