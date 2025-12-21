import { useEffect, useState } from 'react';
import { CreditCard, MapPin, Phone, Mail, User, Save, Camera } from 'lucide-react';
import { getBuyerProfile, updateBuyerProfile } from '../../api/profile';

interface BuyerProfile {
  user_id: string;
  fullname: string;
  username: string;
  email: string;
  phone: string;
  company_name?: string;
  company_email?: string;
  company_phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  profile_image?: string;
}

interface ProfileInfoProps {
  buyerId: string;
}

function ProfileInfo({ buyerId }: ProfileInfoProps) {
  const [profile, setProfile] = useState<BuyerProfile>({
    user_id: '',
    fullname: '',
    username: '',
    email: '',
    phone: '',
    company_name: '',
    company_email: '',
    company_phone: '',
    address: '',
    city: '',
    postal_code: '',
    profile_image: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch profile from backend
 useEffect(() => {
  async function fetchProfile() {
    setLoading(true);
    const data = await getBuyerProfile();

    if (data) {
      setProfile(data);
    } else {
      setMessage("Failed to load profile");
    }

    setLoading(false);
  }

  fetchProfile();
}, []);


  // Handle input changes
  const handleChange = (field: keyof BuyerProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // Save profile to backend
  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const data = await updateBuyerProfile(profile);
      setProfile(data);
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading profile information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-2">
          <CreditCard size={28} className="text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
        </div>
        <p className="text-gray-600">Manage your profile and market details</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm px-6 py-4">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
        <div className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User size={16} />
              Full Name
            </label>
            <input
              type="text"
              value={profile.fullname}
              onChange={(e) => handleChange('fullname', e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} />
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} />
                Phone Number
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+94 71 2345678"
                className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Camera size={16} />
              Profile Image
            </label>
            <input type='image'/>
          </div>
        </div>
      </div>

      {/* Market / Company Information */}
      <div className="bg-white rounded-xl shadow-sm px-6 py-4">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Market / Company Information</h3>
        <div className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User size={16} />
              Market / Company Name
            </label>
            <input
              type="text"
              value={profile.company_name || ''}
              onChange={(e) => handleChange('company_name', e.target.value)}
              placeholder="Enter your Market / Company Name"
              className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} />
                Company Email
              </label>
              <input
                type="email"
                value={profile.company_email || ''}
                onChange={(e) => handleChange('company_email', e.target.value)}
                placeholder="company.email@example.com"
                className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} />
                Company Phone
              </label>
              <input
                type="tel"
                value={profile.company_phone || ''}
                onChange={(e) => handleChange('company_phone', e.target.value)}
                placeholder="+94 71 2345678"
                className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={20} className="text-green-600" />
          <h3 className="text-lg font-bold text-gray-900">Address</h3>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
            <textarea
              value={profile.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter your street address"
              rows={3}
              className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={profile.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Enter city"
                className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
              <input
                type="text"
                value={profile.postal_code || ''}
                onChange={(e) => handleChange('postal_code', e.target.value)}
                placeholder="Enter postal code"
                className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('success')
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-fit px-4 bg-black text-white py-2 rounded-xl font-bold text-lg hover:bg-green-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <Save size={20} />
        {saving ? 'Saving...' : 'Save Information'}
      </button>
    </div>
  );
}

export default ProfileInfo;
