import { Home, Users, ShoppingCart, Wheat, Upload, BarChart3, Brain, Settings, Menu, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'farmers', label: 'Manage Farmers', icon: Users },
  { id: 'buyers', label: 'Manage Buyers', icon: ShoppingCart },
  { id: 'crops', label: 'Manage Crops', icon: Wheat },
  { id: 'upload', label: 'Upload Price Data', icon: Upload },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'ai', label: 'AI Model Management', icon: Brain },
  { id: 'settings', label: 'Settings / Profile', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, isOpen, toggleSidebar }: SidebarProps) {
  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-emerald-700 text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-emerald-900 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          <h1 className="text-xl font-bold">SAMMS Admin Panel</h1>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                  activeTab === item.id
                    ? 'bg-emerald-800 border-l-4 border-emerald-400'
                    : 'hover:bg-emerald-800'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
