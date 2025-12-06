import React from 'react';
import { Instagram, Youtube } from 'lucide-react';
import { AdminSettings } from '../../types';

interface FooterProps {
  settings: AdminSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => (
  <footer className="bg-purple-900 text-purple-200 py-12 mt-20">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex flex-col items-center md:items-start">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
            <span className="text-xl">🧶</span>
          </div>
          <span className="text-xl font-bold text-white">{settings.storeName}</span>
        </div>
        <p className="text-sm opacity-70">Handcrafted with love in {settings.shopLocation || 'our studio'}.</p>
        
        {/* Social Links */}
        <div className="flex gap-4 mt-4">
          {settings.instagramUrl && (
            <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
              <Instagram size={20} className="text-pink-400" />
            </a>
          )}
          {settings.tiktokUrl && (
            <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
              {/* TikTok Icon Placeholder (Letter T in circle style) */}
              <div className="w-5 h-5 flex items-center justify-center font-bold text-white text-xs">T</div>
            </a>
          )}
          {settings.youtubeUrl && (
            <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
              <Youtube size={20} className="text-red-500" />
            </a>
          )}
        </div>
      </div>
      <div className="text-sm opacity-60">
        {settings.copyrightText}
      </div>
    </div>
  </footer>
);
