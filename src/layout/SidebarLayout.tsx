import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/farmer/Sidebar";

const SidebarLayout:React.FC = () => {
     const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return(
        <div className="flex h-screen">
            <div className="flex-none">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
              </div>
            <div className="flex-1 bg-gray-50 p-2 sm:p-4 lg:p-2 overflow-auto h-full">
                <button className="sm:hidden p-2 fixed top-3 left-3 z-40 mb-4 rounded-lg hover:bg-gray-200"
                    onClick={() => setIsSidebarOpen(true)}>
                    <Menu size={24}/> 
                </button>
                <Outlet />
            </div>         
        </div>
    )
}

export default SidebarLayout;