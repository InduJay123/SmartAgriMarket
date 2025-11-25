import emoji from "emoji-dictionary";
import { Home, LogOut, MessageSquare, PlusCircle, Settings, TrendingUp } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/login");
    };

    const menuItems = [
        { name: "Home", icon: Home, path: "/farmer/dashboard" },
        { name: "AI Insights", icon: TrendingUp, path: "/farmer/analytics" },
        { name: "Add Crops", icon: PlusCircle, path: "/farmer/addcrops" },
        { name: "Messages", icon: MessageSquare, path: "/farmer/messages" },
        { name: "Settings", icon: Settings, path: "/farmer/settings" }
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

            {/* SIDEBAR CONTAINER */}
            <div
                className={`
                    fixed left-0 top-0 h-full w-56 bg-white border-r shadow-xl p-4 z-30
                    transform transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    sm:translate-x-0 sm:static sm:block
                `}
            >
                {/* CLOSE BUTTON (MOBILE ONLY) */}
                <div className="flex justify-end sm:hidden mb-4">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-md hover:bg-gray-200"
                    >
                        <svg
                            className="w-6 h-6 text-gray-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* HEADER */}
                <div className="flex items-start gap-3 mb-8">
                    <p className="text-3xl">{emoji.getUnicode("ear_of_rice")}</p>
                    <div>
                        <h2 className="text-xl font-bold">Farmer Portal</h2>
                        <p className="text-gray-500">Neha's Farm</p>
                    </div>
                </div>

                {/* NAVIGATION */}
                <nav className="flex flex-col gap-3 mb-10">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `
                                flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200
                                ${isActive
                                    ? "text-white font-semibold bg-green-700"
                                    : "text-gray-700 hover:bg-gray-200 hover:text-black"
                                }
                            `
                            }
                            onClick={onClose} // closes sidebar on click (mobile)
                        >
                            <item.icon size={20} /> {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* LOGOUT */}
                <button
                    onClick={() => {
                        onClose();
                        handleLogout();
                    }}
                    className="flex w-full gap-2 px-2 py-2 rounded-lg items-center justify-start transition-colors duration-200 text-gray-700 hover:bg-red-800 hover:text-white"
                >
                    <LogOut size={20} /> Log Out
                </button>
            </div>
        </>
    );
};

export default Sidebar;
