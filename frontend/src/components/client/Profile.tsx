import React from 'react';
import { Edit2, LogIn } from 'lucide-react';
import { UserProfile, Notification, ViewState } from '../../types';

interface ProfileProps {
  currentUser: UserProfile;
  updateUser: (user: UserProfile) => void;
  onNavigate: (view: ViewState) => void;
  notifications: Notification[];
}

export const Profile: React.FC<ProfileProps> = ({ currentUser, updateUser, onNavigate, notifications }) => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-pink-100 flex flex-col md:flex-row gap-8 items-start">
      <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
        <div className="relative">
          <img src={currentUser.avatar} className="w-40 h-40 rounded-full border-4 border-pink-200 object-cover" />
          <button className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700"><Edit2 size={16}/></button>
        </div>
        <h2 className="text-2xl font-bold text-purple-900">{currentUser.name}</h2>
        <p className="text-gray-500 text-center text-sm">{currentUser.email}</p>
        
        <button 
          onClick={() => onNavigate(ViewState.LOGIN)} 
          className="flex items-center gap-2 text-red-500 font-semibold hover:bg-red-50 px-6 py-2 rounded-lg transition mt-4"
        >
          <LogIn size={20} /> Sign Out
        </button>
      </div>
      <div className="w-full md:w-2/3 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Shipping Address</h3>
            <textarea 
              className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-200 text-gray-900" 
              defaultValue={currentUser.address}
              placeholder="Enter your full address for deliveries..."
              onBlur={(e) => updateUser({...currentUser, address: e.target.value})}
            />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Phone</h3>
            <input 
              className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-200 text-gray-900" 
              defaultValue={currentUser.phone}
              placeholder="+1 (555) 000-0000"
              onBlur={(e) => updateUser({...currentUser, phone: e.target.value})}
            />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-800 mb-2">Bio</h3>
          <textarea 
            className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-200 text-gray-900" 
            defaultValue={currentUser.bio}
            onBlur={(e) => updateUser({...currentUser, bio: e.target.value})}
          />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 mb-2">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.interests.map((tag, i) => (
              <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">{tag}</span>
            ))}
            <button className="text-purple-600 text-sm font-semibold hover:bg-purple-50 px-3 py-1 rounded-full transition">+ Add Interest</button>
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl">
          <h3 className="font-bold text-blue-800 mb-2">My Order History</h3>
          {notifications.filter(n => n.type === 'ORDER').length > 0 ? (
            <div className="space-y-2">
              {notifications.filter(n => n.type === 'ORDER').map(n => (
                <div key={n.id} className="text-sm text-blue-800 border-b border-blue-100 pb-1">{n.message}</div>
              ))}
            </div>
          ) : (
            <p className="text-blue-600 text-sm">No recent orders found. Time to shop!</p>
          )}
        </div>
      </div>
    </div>
  </div>
);
