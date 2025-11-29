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
      {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-green-700 text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r shadow-xl p-5
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* HEADER */}
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`
                  flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors text-left
                  ${active
                    ? "bg-green-700 text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-200 hover:text-black"
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
