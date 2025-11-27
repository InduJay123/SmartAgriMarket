import { User, Lock, Bell, Globe } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-6">Settings / Profile</h2>

        <div className="space-y-6">
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <User className="text-emerald-600" size={24} />
              <h3 className="font-semibold text-lg">Profile Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value="Malindu Methsara"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  defaultValue="+91 9876543210"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value="adminsmartagri@gmail.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-emerald-600" size={24} />
              <h3 className="font-semibold text-lg">Security</h3>
            </div>
            <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Change Password
            </button>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="text-emerald-600" size={24} />
              <h3 className="font-semibold text-lg">Notifications</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600" />
                <span>Email notifications</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600" />
                <span>Price alert notifications</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 text-emerald-600" />
                <span>System update notifications</span>
              </label>
            </div>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="text-emerald-600" size={24} />
              <h3 className="font-semibold text-lg">Preferences</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>English</option>
                  <option>Sinhala</option>
                  <option>Tamil</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>IST (GMT+5:30)</option>
                  <option>UTC</option>
                </select>
              </div>
            </div>
          </div>

          <button className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
