import React from 'react';
import { ShoppingBag, Clock, Lock } from 'lucide-react';
import { Product } from '../../types/types';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  addToCart: (product: Product) => void;
  setIsCartOpen: (open: boolean) => void;
  isPreviewMode?: boolean;
  onLoginPrompt?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick, addToCart, setIsCartOpen, isPreviewMode = false, onLoginPrompt }) => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div key={product.id} onClick={() => onProductClick(product)} className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition cursor-pointer group">
          <div className="relative h-64 overflow-hidden">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
            {product.discount && product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">-{product.discount}% OFF</span>
            )}
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition">{product.name}</h3>
            <p className="text-gray-500 text-sm line-clamp-2 mb-4">{product.description}</p>
            {!isPreviewMode && (
              <div className="flex justify-between items-center">
                <div>
                  {product.discount && product.discount > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-400 line-through">${product.price.toFixed(2)}</span>
                      <span className="text-2xl font-bold text-purple-900">${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-purple-900">${product.price.toFixed(2)}</span>
                  )}
                  <div className="flex items-center text-xs text-gray-400 mt-1 gap-1"><Clock size={12}/> {product.daysToMake}d make time</div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(product); setIsCartOpen(true); }}
                  className="bg-pink-100 text-pink-600 p-3 rounded-full hover:bg-pink-500 hover:text-white transition"
                >
                  <ShoppingBag size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);
