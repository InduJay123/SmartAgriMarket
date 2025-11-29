import { ShoppingBag, Package, CreditCard, Heart, X } from 'lucide-react';

type View = 'shop' | 'orders' | 'billing' | 'favorites';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
}

function Sidebar({ currentView, setCurrentView, showMobileMenu, setShowMobileMenu }: SidebarProps) {
  const menuItems = [
    { id: 'shop' as View, label: 'Shop', icon: ShoppingBag },
    { id: 'orders' as View, label: 'My Orders', icon: Package },
    { id: 'billing' as View, label: 'Billing Info', icon: CreditCard },
    { id: 'favorites' as View, label: 'Favorites', icon: Heart },
  ];

  const handleItemClick = (view: View) => {
    setCurrentView(view);
    setShowMobileMenu(false);
  };

  return (
    <>
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-auto
          w-64 bg-white rounded-xl shadow-sm p-6
          transform transition-transform duration-300 z-40
          ${showMobileMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between lg:hidden mb-6">
          <h3 className="text-lg font-bold text-gray-900">Menu</h3>
          <button
            onClick={() => setShowMobileMenu(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  font-medium transition-all
                  ${
                    isActive
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
