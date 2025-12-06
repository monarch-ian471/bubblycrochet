import React, { useState } from 'react';
import { Edit2, LogIn, X, Trash2, AlertTriangle } from 'lucide-react';
import { UserProfile, Notification, ViewState } from '../../types/types';

interface ProfileProps {
  currentUser: UserProfile;
  updateUser: (user: UserProfile) => void;
  onNavigate: (view: ViewState) => void;
  notifications: Notification[];
  onDeleteAccount: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ currentUser, updateUser, onNavigate, notifications, onDeleteAccount }) => {
  const [newInterest, setNewInterest] = useState('');
  const [showInterestInput, setShowInterestInput] = useState(false);
  const [bio, setBio] = useState(currentUser.bio);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const saveBio = () => {
    updateUser({...currentUser, bio});
  };

  const addInterest = () => {
    if (newInterest.trim() && !currentUser.interests.includes(newInterest.trim())) {
      const updatedUser = {
        ...currentUser,
        interests: [...currentUser.interests, newInterest.trim()]
      };
      updateUser(updatedUser);
      setNewInterest('');
      setShowInterestInput(false);
    }
  };

  const removeInterest = (interestToRemove: string) => {
    const updatedUser = {
      ...currentUser,
      interests: currentUser.interests.filter(interest => interest !== interestToRemove)
    };
    updateUser(updatedUser);
  };

  const handleDeleteAccount = () => {
    onDeleteAccount();
    setShowDeleteConfirm(false);
  };

  return (
  <>
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
            <h3 className="font-bold text-gray-800 mb-2">Country</h3>
            <select
              className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-200 text-gray-900"
              defaultValue={currentUser.country}
              onChange={(e) => updateUser({...currentUser, country: e.target.value})}
            >
              <option value="">Select Country</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Italy">Italy</option>
              <option value="Spain">Spain</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Belgium">Belgium</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Austria">Austria</option>
              <option value="Ireland">Ireland</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Singapore">Singapore</option>
              <option value="Japan">Japan</option>
              <option value="South Korea">South Korea</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Country Code</h3>
            <select
              className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-200 text-gray-900"
              defaultValue={currentUser.countryCode}
              onChange={(e) => updateUser({...currentUser, countryCode: e.target.value})}
            >
              <option value="">Select Code</option>
              <option value="+1">+1 (US/CA)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+61">+61 (AU)</option>
              <option value="+49">+49 (DE)</option>
              <option value="+33">+33 (FR)</option>
              <option value="+39">+39 (IT)</option>
              <option value="+34">+34 (ES)</option>
              <option value="+31">+31 (NL)</option>
              <option value="+32">+32 (BE)</option>
              <option value="+41">+41 (CH)</option>
              <option value="+43">+43 (AT)</option>
              <option value="+353">+353 (IE)</option>
              <option value="+64">+64 (NZ)</option>
              <option value="+65">+65 (SG)</option>
              <option value="+81">+81 (JP)</option>
              <option value="+82">+82 (KR)</option>
            </select>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Phone</h3>
            <input 
              className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-200 text-gray-900" 
              defaultValue={currentUser.phone}
              placeholder="5550000000"
              onBlur={(e) => updateUser({...currentUser, phone: e.target.value})}
            />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-800 mb-2">Bio</h3>
          <textarea 
            className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-200 text-gray-900" 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            rows={4}
          />
          <button 
            onClick={saveBio}
            className="mt-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            Save Bio
          </button>
        </div>
        <div>
          <h3 className="font-bold text-gray-800 mb-2">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.interests.map((tag, i) => (
              <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {tag}
                <button 
                  onClick={() => removeInterest(tag)}
                  className="hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            {showInterestInput ? (
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                  placeholder="New interest..."
                  className="px-3 py-1 rounded-full text-sm border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  autoFocus
                />
                <button 
                  onClick={addInterest}
                  className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-purple-700 transition"
                >
                  Add
                </button>
                <button 
                  onClick={() => {
                    setShowInterestInput(false);
                    setNewInterest('');
                  }}
                  className="text-gray-500 text-sm font-semibold hover:bg-gray-100 px-3 py-1 rounded-full transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowInterestInput(true)}
                className="text-purple-600 text-sm font-semibold hover:bg-purple-50 px-3 py-1 rounded-full transition"
              >
                + Add Interest
              </button>
            )}
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
            <p className="text-blue-600 text-sm">No recent orders found. Time to browse our collection!</p>
          )}
        </div>
        
        {/* Delete Account Section */}
        <div className="bg-red-50 p-6 rounded-xl border border-red-200">
          <h3 className="font-bold text-red-800 mb-2">Delete Account</h3>
          <p className="text-red-600 text-sm mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
          >
            <Trash2 size={16} />
            Delete My Account
          </button>
        </div>
      </div>
    </div>
    
    {/* Delete Confirmation Modal */}
    {showDeleteConfirm && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={32} className="text-red-600" />
            <h3 className="text-2xl font-bold text-gray-900">Delete Account?</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Are you absolutely sure you want to delete your account? This will permanently remove:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
            <li>Your profile information</li>
            <li>Order history</li>
            <li>Saved preferences</li>
            <li>All personal data</li>
          </ul>
          <p className="text-red-600 font-semibold mb-6">
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Yes, Delete Account
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  </>
);
};
