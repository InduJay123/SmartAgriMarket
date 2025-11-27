import { Bell, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-end gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} className="text-gray-600" />
        </button>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 hidden sm:block">Profile</span>
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
