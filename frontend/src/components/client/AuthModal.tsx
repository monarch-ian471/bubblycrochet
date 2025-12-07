import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { YarnLogo } from '../Visuals';
import { ViewState } from '../../types/types';

interface AuthModalProps {
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authMode: 'LOGIN' | 'SIGNUP';
  setAuthMode: (mode: 'LOGIN' | 'SIGNUP') => void;
  authError: string | null;
  setAuthError: (error: string | null) => void;
  handleAuthSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onNavigate: (view: ViewState) => void;
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
  { code: '+222', label: '+222 (MR)' },
  { code: '+223', label: '+223 (ML)' },
  { code: '+224', label: '+224 (GN)' },
  { code: '+225', label: '+225 (CI)' },
  { code: '+226', label: '+226 (BF)' },
  { code: '+227', label: '+227 (NE)' },
  { code: '+228', label: '+228 (TG)' },
  { code: '+229', label: '+229 (BJ)' },
  { code: '+230', label: '+230 (MU)' },
  { code: '+231', label: '+231 (LR)' },
  { code: '+232', label: '+232 (SL)' },
  { code: '+233', label: '+233 (GH)' },
  { code: '+234', label: '+234 (NG)' },
  { code: '+235', label: '+235 (TD)' },
  { code: '+236', label: '+236 (CF)' },
  { code: '+237', label: '+237 (CM)' },
  { code: '+238', label: '+238 (CV)' },
  { code: '+239', label: '+239 (ST)' },
  { code: '+240', label: '+240 (GQ)' },
  { code: '+241', label: '+241 (GA)' },
  { code: '+242', label: '+242 (CG)' },
  { code: '+243', label: '+243 (CD)' },
  { code: '+244', label: '+244 (AO)' },
  { code: '+245', label: '+245 (GW)' },
  { code: '+246', label: '+246 (IO)' },
  { code: '+248', label: '+248 (SC)' },
  { code: '+249', label: '+249 (SD)' },
  { code: '+250', label: '+250 (RW)' },
  { code: '+251', label: '+251 (ET)' },
  { code: '+252', label: '+252 (SO)' },
  { code: '+253', label: '+253 (DJ)' },
  { code: '+254', label: '+254 (KE)' },
  { code: '+255', label: '+255 (TZ)' },
  { code: '+256', label: '+256 (UG)' },
  { code: '+257', label: '+257 (BI)' },
  { code: '+258', label: '+258 (MZ)' },
  { code: '+260', label: '+260 (ZM)' },
  { code: '+261', label: '+261 (MG)' },
  { code: '+262', label: '+262 (RE)' },
  { code: '+263', label: '+263 (ZW)' },
  { code: '+264', label: '+264 (NA)' },
  { code: '+265', label: '+265 (MW)' },
  { code: '+266', label: '+266 (LS)' },
  { code: '+267', label: '+267 (BW)' },
  { code: '+268', label: '+268 (SZ)' },
  { code: '+269', label: '+269 (KM)' },
  { code: '+290', label: '+290 (SH)' },
  { code: '+291', label: '+291 (ER)' },
  { code: '+297', label: '+297 (AW)' },
  { code: '+298', label: '+298 (FO)' },
  { code: '+299', label: '+299 (GL)' },
  { code: '+350', label: '+350 (GI)' },
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
  { code: '+382', label: '+382 (ME)' },
  { code: '+383', label: '+383 (XK)' },
  { code: '+385', label: '+385 (HR)' },
  { code: '+386', label: '+386 (SI)' },
  { code: '+387', label: '+387 (BA)' },
  { code: '+389', label: '+389 (MK)' },
  { code: '+420', label: '+420 (CZ)' },
  { code: '+421', label: '+421 (SK)' },
  { code: '+423', label: '+423 (LI)' },
  { code: '+500', label: '+500 (FK)' },
  { code: '+501', label: '+501 (BZ)' },
  { code: '+502', label: '+502 (GT)' },
  { code: '+503', label: '+503 (SV)' },
  { code: '+504', label: '+504 (HN)' },
  { code: '+505', label: '+505 (NI)' },
  { code: '+506', label: '+506 (CR)' },
  { code: '+507', label: '+507 (PA)' },
  { code: '+508', label: '+508 (PM)' },
  { code: '+509', label: '+509 (HT)' },
  { code: '+590', label: '+590 (GP)' },
  { code: '+591', label: '+591 (BO)' },
  { code: '+592', label: '+592 (GY)' },
  { code: '+593', label: '+593 (EC)' },
  { code: '+594', label: '+594 (GF)' },
  { code: '+595', label: '+595 (PY)' },
  { code: '+596', label: '+596 (MQ)' },
  { code: '+597', label: '+597 (SR)' },
  { code: '+598', label: '+598 (UY)' },
  { code: '+599', label: '+599 (CW)' },
  { code: '+670', label: '+670 (TL)' },
  { code: '+672', label: '+672 (NF)' },
  { code: '+673', label: '+673 (BN)' },
  { code: '+674', label: '+674 (NR)' },
  { code: '+675', label: '+675 (PG)' },
  { code: '+676', label: '+676 (TO)' },
  { code: '+677', label: '+677 (SB)' },
  { code: '+678', label: '+678 (VU)' },
  { code: '+679', label: '+679 (FJ)' },
  { code: '+680', label: '+680 (PW)' },
  { code: '+681', label: '+681 (WF)' },
  { code: '+682', label: '+682 (CK)' },
  { code: '+683', label: '+683 (NU)' },
  { code: '+685', label: '+685 (WS)' },
  { code: '+686', label: '+686 (KI)' },
  { code: '+687', label: '+687 (NC)' },
  { code: '+688', label: '+688 (TV)' },
  { code: '+689', label: '+689 (PF)' },
  { code: '+690', label: '+690 (TK)' },
  { code: '+691', label: '+691 (FM)' },
  { code: '+692', label: '+692 (MH)' },
  { code: '+850', label: '+850 (KP)' },
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
  { code: '+970', label: '+970 (PS)' },
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

export const AuthModal: React.FC<AuthModalProps> = ({
  showAuthModal,
  setShowAuthModal,
  authMode,
  setAuthMode,
  authError,
  setAuthError,
  handleAuthSubmit,
  onNavigate
}) => {
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');

  if (!showAuthModal) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError('');
    
    if (authMode === 'SIGNUP') {
      const formData = new FormData(e.currentTarget);
      const password = formData.get('password') as string;
      
      if (password !== passwordConfirm) {
        setPasswordError('Passwords do not match');
        return;
      }
    }
    
    handleAuthSubmit(e);
  };
  
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAuthModal(false)}></div>
      <div className="relative bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        <div className="text-center mb-6">
          <YarnLogo size="sm" animated />
          <h2 className="text-2xl font-bold text-purple-900 mt-4">{authMode === 'LOGIN' ? 'Welcome Back!' : 'Join the Club'}</h2>
          <p className="text-gray-500 text-sm">
            {authMode === 'LOGIN' 
              ? 'Sign in to save your favorite items and track orders.' 
              : 'Create an account to start shopping and track your orders.'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {authError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center text-sm">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" />
              {authError}
            </div>
          )}
          {passwordError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center text-sm">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" />
              {passwordError}
            </div>
          )}
          <input 
            name="email" 
            type="email" 
            placeholder="Email Address" 
            required 
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" 
          />
          {authMode === 'SIGNUP' && (
            <>
              <input 
                name="name" 
                type="text" 
                placeholder="Full Name" 
                required 
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" 
              />
              <input 
                name="address" 
                type="text" 
                placeholder="Full Delivery Address" 
                required 
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" 
              />
              
              <select 
                name="country" 
                required 
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition appearance-none cursor-pointer"
              >
                <option value="">Select Country</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              
              <div className="flex gap-3">
                <select 
                  name="countryCode" 
                  required 
                  className="w-36 p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition appearance-none cursor-pointer"
                >
                  <option value="">Code</option>
                  {COUNTRY_CODES.map(({ code, label }) => (
                    <option key={code} value={code}>{label}</option>
                  ))}
                </select>
                <input 
                  name="phone" 
                  type="tel" 
                  placeholder="Phone Number" 
                  required 
                  className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" 
                />
              </div>
            </>
          )}
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            required 
            minLength={6}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" 
          />
          {authMode === 'SIGNUP' && (
            <input 
              type="password" 
              placeholder="Confirm Password" 
              required 
              minLength={6}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" 
            />
          )}
          
          <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg hover:shadow-xl">
            {authMode === 'LOGIN' ? 'Log In' : 'Create Account'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button 
            onClick={() => { 
              setAuthMode(authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN'); 
              setAuthError(null); 
              setPasswordError('');
              setPasswordConfirm('');
            }} 
            className="text-purple-600 text-sm hover:underline font-semibold"
          >
            {authMode === 'LOGIN' ? "New here? Create an account" : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};
