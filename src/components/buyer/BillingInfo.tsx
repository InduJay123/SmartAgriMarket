import { useEffect, useState } from 'react';
import { CreditCard, MapPin, Phone, Mail, User, Save } from 'lucide-react';

interface BuyerProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
}

interface BillingInfoProps {
  buyerId: string;
}

function BillingInfo({ buyerId }: BillingInfoProps) {
  const [profile, setProfile] = useState<BuyerProfile>({
    id: '',
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    setTimeout(() => {
      const savedProfile = localStorage.getItem(`profile_${buyerId}`);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
      setLoading(false);
    }, 300);
  };

  const handleSave = () => {
    setSaving(true);
    setMessage('');

    setTimeout(() => {
      localStorage.setItem(`profile_${buyerId}`, JSON.stringify(profile));
      setMessage('Profile updated successfully!');
      setSaving(false);
    }, 500);
  };

  const handleChange = (field: keyof BuyerProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading billing information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-2">
          <CreditCard size={28} className="text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">Billing Information</h2>
        </div>
        <p className="text-gray-600">Manage your billing and shipping details</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>

        <div className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User size={16} />
              Full Name
            </label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
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
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <MapPin size={20} className="text-green-600" />
          <h3 className="text-lg font-bold text-gray-900">Shipping Address</h3>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address
            </label>
            <textarea
              value={profile.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter your street address"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Enter city"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                value={profile.postal_code}
                onChange={(e) => handleChange('postal_code', e.target.value)}
                placeholder="Enter postal code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
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
        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <Save size={20} />
        {saving ? 'Saving...' : 'Save Information'}
      </button>
    </div>
  );
}

export default BillingInfo;
