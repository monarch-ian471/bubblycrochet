import React from 'react';
import { Edit2, Instagram, Youtube } from 'lucide-react';
import { AdminSettings } from '../../types';

interface SettingsManagementProps {
  settings: AdminSettings;
  setSettings: (settings: AdminSettings) => void;
}

export const SettingsManagement: React.FC<SettingsManagementProps> = ({ settings, setSettings }) => (
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
