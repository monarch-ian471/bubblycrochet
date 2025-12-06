import React from 'react';
import { ArrowLeft, ShoppingBag, Clock, Truck, Star } from 'lucide-react';
import { Product, Review, ViewState } from '../../types/types';

interface ProductDetailProps {
  product: Product | null;
  reviews: Review[];
  isLoggedIn: boolean;
  reviewText: string;
  reviewRating: number;
  setReviewText: (text: string) => void;
  setReviewRating: (rating: number) => void;
  onSubmitReview: (productId: string, comment: string, rating: number) => void;
  addToCart: (product: Product) => void;
  setIsCartOpen: (open: boolean) => void;
  setView: (view: ViewState) => void;
  setAuthMode: (mode: 'LOGIN' | 'SIGNUP') => void;
  setShowAuthModal: (show: boolean) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  reviews,
  isLoggedIn,
  reviewText,
  reviewRating,
  setReviewText,
  setReviewRating,
  onSubmitReview,
  addToCart,
  setIsCartOpen,
  setView,
  setAuthMode,
  setShowAuthModal
}) => {
  if (!product) return null;
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in zoom-in-95 duration-300">
      <button onClick={() => setView(ViewState.SHOP)} className="flex items-center text-purple-600 mb-6 hover:underline"><ArrowLeft size={20} className="mr-2"/> Back to Collections</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-3xl shadow-sm border border-pink-50">
        <div className="space-y-4">
          <img src={product.images[0]} className="w-full rounded-2xl shadow-lg" alt={product.name}/>
          <div className="grid grid-cols-4 gap-2">
            {product.images.slice(0, 4).map((img, i) => (
              <img key={i} src={img} className="w-full h-24 object-cover rounded-lg cursor-pointer opacity-70 hover:opacity-100" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <span className="text-pink-500 font-bold tracking-wider text-sm uppercase">{product.category}</span>
            <h1 className="text-4xl font-bold text-purple-900 mt-2">{product.name}</h1>
            <div className="flex items-center mt-4 space-x-4">
              {product.discount && product.discount > 0 ? (
                <>
                  <span className="text-2xl text-gray-400 line-through">${product.price.toFixed(2)}</span>
                  <span className="text-3xl font-bold text-purple-900">${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                  <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">-{product.discount}% OFF</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
              )}
            </div>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Clock size={16}/> Ready in ~{product.daysToMake} days</span>
              <span className="flex items-center gap-1"><Truck size={16}/> Shipping: ${product.shippingCost}</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>

          <button 
            onClick={() => { addToCart(product); setIsCartOpen(true); }}
            className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition flex items-center justify-center gap-3"
          >
            <ShoppingBag /> Add to Cart
          </button>

          <div className="border-t border-gray-100 pt-6 mt-6">
            <h3 className="font-bold text-gray-800 mb-4">Customer Reviews</h3>
            <div className="space-y-4">
              {reviews.filter(r => r.productId === product.id).map(review => (
                <div key={review.id} className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-sm text-purple-900 block">{review.userName}</span>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />)}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
              ))}
              {reviews.filter(r => r.productId === product.id).length === 0 && (
                <p className="text-gray-400 italic">No reviews yet. Be the first!</p>
              )}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              {isLoggedIn ? (
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-800">Leave a Review</h4>
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setReviewRating(star)}
                        className="text-yellow-400 hover:scale-110 transition"
                      >
                        <Star size={24} fill={star <= reviewRating ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-900" 
                      placeholder="Share your thoughts..." 
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                    <button 
                      onClick={() => {
                        if (reviewText.trim()) {
                          onSubmitReview(product.id, reviewText, reviewRating);
                          setReviewText('');
                        }
                      }}
                      className="bg-purple-600 text-white px-4 rounded-lg font-bold hover:bg-purple-700 transition"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-purple-800 text-sm mb-2">Want to leave a review?</p>
                  <button 
                    onClick={() => { setAuthMode('LOGIN'); setShowAuthModal(true); }}
                    className="text-purple-600 font-bold hover:underline"
                  >
                    Log in or Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
