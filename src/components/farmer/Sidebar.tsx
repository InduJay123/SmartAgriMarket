// Sidebar.tsx
import { Bell, FileSpreadsheet, Home, LogOut, MessageSquare, MessagesSquare, PlusCircle, Settings, TrendingUp, User, Brain } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {

     const { t, i18n } = useTranslation();
     const isSinhala = i18n.language === "si";


    const navigate = useNavigate();

    const handleLogout = () => navigate("/login");

    const menuItems = [
        { name: t("Home"), icon: Home, path: "/farmer/dashboard" },
        { name: t("AI Insights"), icon: Brain, path: "/farmer/ai-insights" },
        { name: t("Add Crops"), icon: PlusCircle, path: "/farmer/addcrops" },
        { name: t("Daily Price List"), icon: FileSpreadsheet, path: "/farmer/pricelist" },
        { name: t("Messages"), icon: MessagesSquare, path: "/farmer/messages" },
        { name: t("Alerts"), icon: Bell, path: "/farmer/alerts" },
        { name: t("My Profile"), icon: User, path: "/farmer/profile" }
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
                    ${isSinhala ? "font-sinhala" : "font-sans"}
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
