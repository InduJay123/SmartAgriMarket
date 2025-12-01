import { useState } from "react";
import { Menu, User, Bell, TrendingUp, } from "lucide-react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/buyer/Sidebar";

const SideBarLayout: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="w-screen bg-gray-50 flex flex-col justify-between ">

      {/* ===== TOP NAVBAR ===== */}
      <header className="bg-white shadow-sm sticky top-0 z-40 px-4">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* LEFT: Mobile Menu + Logo */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowSidebar(true)} 
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu size={24} />
              </button>

              <div className="flex items-center gap-2">
                <p className="text-3xl"><TrendingUp/></p>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Buyer Portal</h1>
                  <p className="text-xs text-gray-500">Henri's Farm</p>
                </div>
              </div>
            </div>

            

            {/* RIGHT ICONS */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Bell size={22} />
              </button>
              <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <User size={22} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ===== PAGE CONTENT ===== */}
      <div className="flex flex-1 min-h-0">

        {/* SIDEBAR */}
        <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)}/>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-auto min-h-0 pl-10 pr-40">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default SideBarLayout;