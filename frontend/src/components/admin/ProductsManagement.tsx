import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, ImageIcon, Upload, X } from 'lucide-react';
import { Product } from '../../types/types';

interface ProductsManagementProps {
  products: Product[];
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  handleDelete: (id: string) => void;
  handleSaveProduct: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const ProductsManagement: React.FC<ProductsManagementProps> = ({
  products,
  editingProduct,
  setEditingProduct,
  handleDelete,
  handleSaveProduct
}) => {
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (editingProduct?.images[0]) {
      setImagePreview(editingProduct.images[0]);
    } else {
      setImagePreview('');
    }
  }, [editingProduct]);

  return (
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
                <option>Home Decor</option>
                <option>Seasonal Items</option>
                <option>Custom Orders</option>
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
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock Status</label>
              <select name="inStock" defaultValue={editingProduct.inStock ? 'true' : 'false'} className="w-full mt-1 p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900">
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" defaultValue={editingProduct.description} rows={3} className="w-full mt-1 p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <div
              onDrop={handleImageDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative border-2 border-dashed rounded-lg p-6 transition ${
                isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50'
              }`}
            >
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setImagePreview('')}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                  <input type="hidden" name="imageUrl" value={imagePreview} />
                </div>
              ) : (
                <div className="text-center">
                  <Upload size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-2">Drag and drop an image here</p>
                  <p className="text-gray-400 text-sm mb-3">or</p>
                  <label className="cursor-pointer">
                    <span className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition inline-block">
                      Browse Files
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                  <input type="hidden" name="imageUrl" value="" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Supports: JPG, PNG, GIF (Max 5MB)</p>
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
};
