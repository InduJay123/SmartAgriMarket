import { Home, Users, Leaf,  Upload, FileText, Brain, Settings, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showMobileMenu: boolean;
  setShowMobileMenu: (open: boolean) => void;
}

const Sidebar:React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  showMobileMenu,
  setShowMobileMenu,
}) => {
  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: Home },
    { id: "farmers", name: "Manage Farmers", icon: Users },
    { id: "buyers", name: "Manage Buyers", icon: Users },
    { id: "crops", name: "Manage Crops", icon: Leaf },
    { id: "upload", name: "Upload Prices", icon: Upload },
    { id: "reports", name: "Reports", icon: FileText },
    { id: "ai", name: "AI Insights", icon: Brain },
    { id: "settings", name: "Settings", icon: Settings },
  ];

   const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/login");
    };

  return (
    <>
      {/* --- MOBILE OVERLAY --- */}
      

      {/* --- SIDEBAR PANEL --- */}
      <aside
        className={`
          fixed lg:static top-0 left-0 w-64 bg-white border-r shadow-lg z-40
          transform transition-transform duration-300 h-screen
          ${showMobileMenu ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Close button (mobile only) */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={() => setShowMobileMenu(false)}
            className="p-2 rounded-lg hover:bg-gray-200"
          >
            <X size={22} />
          </button>
        </div>

        {/* MENU LIST */}
        <nav className="flex flex-col gap-1 px-4 py-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setShowMobileMenu(false);
              }}
              className={`
                flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-all
                ${
                  activeTab === item.id
                    ? "bg-green-600 text-white hover:border-none"
                    : "text-gray-700 hover:bg-gray-100 hover:border-none"
                }
              `}
            >
              <item.icon size={20} />
              {item.name}
            </button>
          ))}
        </nav>

        <button
          onClick={() => {           
            handleLogout();
          }}
          className="flex gap-3 mx-4 my-4 px-8 py-2 rounded-lg items-center justify-start transition-colors duration-200 text-gray-700 hover:bg-red-800 hover:text-white border-none"
        >
          <LogOut size={20} /> Log Out
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
