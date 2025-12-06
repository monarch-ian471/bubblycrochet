import React from 'react';
import { FadeIn } from '../Visuals';
import { ViewState } from '../../types';

interface HeroProps {
  setView: (view: ViewState) => void;
}

export const Hero: React.FC<HeroProps> = ({ setView }) => (
  <div className="bg-gradient-to-b from-purple-100 to-fuchsia-50 py-20 px-4 text-center">
    <FadeIn>
      <h1 className="text-5xl md:text-6xl font-bold text-purple-900 mb-6">Handmade with Love,<br/>Stitched for You</h1>
      <p className="text-xl text-purple-700 mb-8 max-w-2xl mx-auto">Discover unique, handcrafted crochet treasures made to bring warmth and joy to your home.</p>
      <button 
        onClick={() => setView(ViewState.SHOP)}
        className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 hover:scale-105 transition transform"
      >
        Explore Collections
      </button>
    </FadeIn>
  </div>
);
