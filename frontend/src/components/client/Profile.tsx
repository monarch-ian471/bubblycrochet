import React, { useState } from 'react';
import { Edit2, LogIn, X, Trash2, AlertTriangle, Lock, Check, AlertCircle } from 'lucide-react';
import { UserProfile, Notification, ViewState } from '../../types/types';
import { api } from '../../services/api';

interface ProfileProps {
  currentUser: UserProfile;
  updateUser: (user: UserProfile) => void;
  onNavigate: (view: ViewState) => void;
  notifications: Notification[];
  onDeleteAccount: () => void;
}

// Comprehensive country list
const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
  'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
  'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada',
  'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia',
  'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt',
  'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia',
  'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti',
  'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
  'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'North Korea', 'South Korea', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
  'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia',
  'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles',
  'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka',
  'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo',
  'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

// Comprehensive country codes
const COUNTRY_CODES = [
  { code: '+1', label: '+1 (US/CA)' },
  { code: '+7', label: '+7 (RU/KZ)' },
  { code: '+20', label: '+20 (EG)' },
  { code: '+27', label: '+27 (ZA)' },
  { code: '+30', label: '+30 (GR)' },
  { code: '+31', label: '+31 (NL)' },
  { code: '+32', label: '+32 (BE)' },
  { code: '+33', label: '+33 (FR)' },
  { code: '+34', label: '+34 (ES)' },
  { code: '+36', label: '+36 (HU)' },
  { code: '+39', label: '+39 (IT)' },
  { code: '+40', label: '+40 (RO)' },
  { code: '+41', label: '+41 (CH)' },
  { code: '+43', label: '+43 (AT)' },
  { code: '+44', label: '+44 (UK)' },
  { code: '+45', label: '+45 (DK)' },
  { code: '+46', label: '+46 (SE)' },
  { code: '+47', label: '+47 (NO)' },
  { code: '+48', label: '+48 (PL)' },
  { code: '+49', label: '+49 (DE)' },
  { code: '+51', label: '+51 (PE)' },
  { code: '+52', label: '+52 (MX)' },
  { code: '+53', label: '+53 (CU)' },
  { code: '+54', label: '+54 (AR)' },
  { code: '+55', label: '+55 (BR)' },
  { code: '+56', label: '+56 (CL)' },
  { code: '+57', label: '+57 (CO)' },
  { code: '+58', label: '+58 (VE)' },
  { code: '+60', label: '+60 (MY)' },
  { code: '+61', label: '+61 (AU)' },
  { code: '+62', label: '+62 (ID)' },
  { code: '+63', label: '+63 (PH)' },
  { code: '+64', label: '+64 (NZ)' },
  { code: '+65', label: '+65 (SG)' },
  { code: '+66', label: '+66 (TH)' },
  { code: '+81', label: '+81 (JP)' },
  { code: '+82', label: '+82 (KR)' },
  { code: '+84', label: '+84 (VN)' },
  { code: '+86', label: '+86 (CN)' },
  { code: '+90', label: '+90 (TR)' },
  { code: '+91', label: '+91 (IN)' },
  { code: '+92', label: '+92 (PK)' },
  { code: '+93', label: '+93 (AF)' },
  { code: '+94', label: '+94 (LK)' },
  { code: '+95', label: '+95 (MM)' },
  { code: '+98', label: '+98 (IR)' },
  { code: '+212', label: '+212 (MA)' },
  { code: '+213', label: '+213 (DZ)' },
  { code: '+216', label: '+216 (TN)' },
  { code: '+218', label: '+218 (LY)' },
  { code: '+220', label: '+220 (GM)' },
  { code: '+221', label: '+221 (SN)' },
  { code: '+234', label: '+234 (NG)' },
  { code: '+250', label: '+250 (RW)' },
  { code: '+251', label: '+251 (ET)' },
  { code: '+254', label: '+254 (KE)' },
  { code: '+255', label: '+255 (TZ)' },
  { code: '+256', label: '+256 (UG)' },
  { code: '+260', label: '+260 (ZM)' },
  { code: '+263', label: '+263 (ZW)' },
  { code: '+264', label: '+264 (NA)' },
  { code: '+265', label: '+265 (MW)' },
  { code: '+267', label: '+267 (BW)' },
  { code: '+351', label: '+351 (PT)' },
  { code: '+352', label: '+352 (LU)' },
  { code: '+353', label: '+353 (IE)' },
  { code: '+354', label: '+354 (IS)' },
  { code: '+355', label: '+355 (AL)' },
  { code: '+356', label: '+356 (MT)' },
  { code: '+357', label: '+357 (CY)' },
  { code: '+358', label: '+358 (FI)' },
  { code: '+359', label: '+359 (BG)' },
  { code: '+370', label: '+370 (LT)' },
  { code: '+371', label: '+371 (LV)' },
  { code: '+372', label: '+372 (EE)' },
  { code: '+373', label: '+373 (MD)' },
  { code: '+374', label: '+374 (AM)' },
  { code: '+375', label: '+375 (BY)' },
  { code: '+376', label: '+376 (AD)' },
  { code: '+377', label: '+377 (MC)' },
  { code: '+378', label: '+378 (SM)' },
  { code: '+380', label: '+380 (UA)' },
  { code: '+381', label: '+381 (RS)' },
  { code: '+385', label: '+385 (HR)' },
  { code: '+386', label: '+386 (SI)' },
  { code: '+420', label: '+420 (CZ)' },
  { code: '+421', label: '+421 (SK)' },
  { code: '+500', label: '+500 (FK)' },
  { code: '+501', label: '+501 (BZ)' },
  { code: '+502', label: '+502 (GT)' },
  { code: '+503', label: '+503 (SV)' },
  { code: '+504', label: '+504 (HN)' },
  { code: '+505', label: '+505 (NI)' },
  { code: '+506', label: '+506 (CR)' },
  { code: '+507', label: '+507 (PA)' },
  { code: '+509', label: '+509 (HT)' },
  { code: '+591', label: '+591 (BO)' },
  { code: '+593', label: '+593 (EC)' },
  { code: '+595', label: '+595 (PY)' },
  { code: '+598', label: '+598 (UY)' },
  { code: '+670', label: '+670 (TL)' },
  { code: '+673', label: '+673 (BN)' },
  { code: '+675', label: '+675 (PG)' },
  { code: '+679', label: '+679 (FJ)' },
  { code: '+685', label: '+685 (WS)' },
  { code: '+852', label: '+852 (HK)' },
  { code: '+853', label: '+853 (MO)' },
  { code: '+855', label: '+855 (KH)' },
  { code: '+856', label: '+856 (LA)' },
  { code: '+880', label: '+880 (BD)' },
  { code: '+886', label: '+886 (TW)' },
  { code: '+960', label: '+960 (MV)' },
  { code: '+961', label: '+961 (LB)' },
  { code: '+962', label: '+962 (JO)' },
  { code: '+963', label: '+963 (SY)' },
  { code: '+964', label: '+964 (IQ)' },
  { code: '+965', label: '+965 (KW)' },
  { code: '+966', label: '+966 (SA)' },
  { code: '+967', label: '+967 (YE)' },
  { code: '+968', label: '+968 (OM)' },
  { code: '+971', label: '+971 (AE)' },
  { code: '+972', label: '+972 (IL)' },
  { code: '+973', label: '+973 (BH)' },
  { code: '+974', label: '+974 (QA)' },
  { code: '+975', label: '+975 (BT)' },
  { code: '+976', label: '+976 (MN)' },
  { code: '+977', label: '+977 (NP)' },
  { code: '+992', label: '+992 (TJ)' },
  { code: '+993', label: '+993 (TM)' },
  { code: '+994', label: '+994 (AZ)' },
  { code: '+995', label: '+995 (GE)' },
  { code: '+996', label: '+996 (KG)' },
  { code: '+998', label: '+998 (UZ)' }
];

export const Profile: React.FC<ProfileProps> = ({ currentUser, updateUser, onNavigate, notifications, onDeleteAccount }) => {
  const [newInterest, setNewInterest] = useState('');
  const [showInterestInput, setShowInterestInput] = useState(false);
  const [bio, setBio] = useState(currentUser.bio);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      const result = await api.auth.changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (result.success) {
        setPasswordSuccess('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          setPasswordSuccess('');
          setShowPasswordSection(false);
        }, 2000);
      } else {
        setPasswordError(result.message || 'Failed to change password');
      }
    } catch (error) {
      setPasswordError('Failed to change password');
    }
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
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 transition" 
              defaultValue={currentUser.address}
              placeholder="Enter your full address for deliveries..."
              onBlur={(e) => updateUser({...currentUser, address: e.target.value})}
            />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Country</h3>
            <select
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 transition appearance-none cursor-pointer"
              defaultValue={currentUser.country}
              onChange={(e) => updateUser({...currentUser, country: e.target.value})}
            >
              <option value="">Select Country</option>
              {COUNTRIES.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Country Code</h3>
            <select
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 transition appearance-none cursor-pointer"
              defaultValue={currentUser.countryCode}
              onChange={(e) => updateUser({...currentUser, countryCode: e.target.value})}
            >
              <option value="">Select Code</option>
              {COUNTRY_CODES.map(({ code, label }) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Phone</h3>
            <input 
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 transition" 
              defaultValue={currentUser.phone}
              placeholder="5550000000"
              onBlur={(e) => updateUser({...currentUser, phone: e.target.value})}
            />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-800 mb-2">Bio</h3>
          <textarea 
            className="w-full p-4 bg-gray-50 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 transition" 
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

        {/* Password Change Section */}
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-purple-800 flex items-center gap-2">
                <Lock size={20} />
                Security Settings
              </h3>
              <p className="text-purple-600 text-sm">Update your password</p>
            </div>
            {!showPasswordSection && (
              <button
                onClick={() => setShowPasswordSection(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-semibold"
              >
                Change Password
              </button>
            )}
          </div>

          {showPasswordSection && (
            <form onSubmit={handlePasswordChange} className="space-y-4 pt-4 border-t border-purple-200">
              {passwordError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center text-sm">
                  <AlertCircle size={16} className="mr-2" />
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="bg-green-50 text-green-600 p-3 rounded-lg flex items-center text-sm">
                  <Check size={16} className="mr-2" />
                  {passwordSuccess}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  required
                  className="w-full mt-1 p-3 border border-purple-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  required
                  minLength={6}
                  className="w-full mt-1 p-3 border border-purple-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  required
                  minLength={6}
                  className="w-full mt-1 p-3 border border-purple-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordSection(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordError('');
                  }}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                >
                  Update Password
                </button>
              </div>
            </form>
          )}
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
