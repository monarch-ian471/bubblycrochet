import React from 'react';
import { Instagram, Youtube } from 'lucide-react';
import { AdminSettings } from '../../types/types';

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
              {/* TikTok Icon (Custom SVG) */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
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
