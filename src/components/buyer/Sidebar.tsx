// Sidebar.tsx
import { Bell, FileSpreadsheet,  Heart,  LogOut, MessagesSquare, Package,ShoppingBag, User, } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleLogout = () => navigate("/login");

    const menuItems = [
      { name: "Marketplace", icon: ShoppingBag, path: "/buyer/shop" },    
      { name: "Favorites", icon: Heart, path: "/buyer/favourites" },
      { name: "Daily Price List", icon: FileSpreadsheet, path: "/buyer/pricelist" },
      { name: "Messages", icon: MessagesSquare, path: "/buyer/messages" },
      { name: "Alerts", icon: Bell, path: "/buyer/alerts" }, 
      { name: "My Profile", icon: User, path: "/buyer/profile" },
    ];

    return (
        <>
            {/* MOBILE OVERLAY */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-20 sm:hidden"
                    onClick={onClose}
                ></div>
            )}

            {/* SIDEBAR */}
            <div
                className={`
                    fixed left-0 top-0 h-screen w-60 bg-white border-r shadow-xl p-4 z-30
                    transform transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    sm:translate-x-0 sm:static sm:block
                `}
            >
                {/* CLOSE BUTTON MOBILE */}
                <div className="flex justify-end sm:hidden mb-4">
                    <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-200">
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* NAVIGATION */}
                <nav className="flex flex-col gap-3 mb-10">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200
                                ${isActive
                                    ? "text-white font-semibold bg-green-700 hover:text-white/80"
                                    : "text-gray-700 hover:bg-gray-200 hover:text-black"}`
                            }
                            onClick={onClose} // closes sidebar on click (mobile)
                        >
                            <item.icon size={20} /> {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* LOGOUT */}
                <button
                    onClick={() => { onClose(); handleLogout(); }}
                    className="flex w-full gap-2 px-2 py-2 rounded-lg items-center justify-start transition-colors duration-200 text-gray-700 hover:bg-red-800 hover:text-white"
                >
                    <LogOut size={20} /> Log Out
                </button>
            </div>
        </>
    );
};

export default Sidebar;