import { useEffect, useState } from "react";
import { Menu, User } from "lucide-react";
import Sidebar from "../components/farmer/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import emoji from "emoji-dictionary";
import { getFarmerProfile } from "../api/farmer/farmerProfile";

const SideBarLayout: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [farmer, setFarmer] = useState<{ fullname: string; first_name: string , profile_image: string } | null>(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFarmer = async () => {
      const data = await getFarmerProfile();
      setFarmer({
        fullname: data?.farmer_details?.fullname,
        first_name: data?.first_name,
        profile_image: data?.farmer_details?.profile_image,
      });
    };
    fetchFarmer();
  }, []);
 
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
                <p className="text-3xl">{emoji.getUnicode("ear_of_rice")}</p>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Farmer Portal</h1>
                  <p className="text-xs text-gray-500">{farmer?.first_name || "Account"}'s Farm</p>
                </div>
              </div>
            </div>

            {/* RIGHT ICONS */}
            <div className="flex items-center gap-4">
               <button 
                onClick={() => navigate("/farmer/profile")}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                {farmer?.profile_image ? (
                  <img
                    src={farmer.profile_image}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <User size={20} />
                )}
                <span className="text-sm font-medium">{farmer?.fullname || "Account"}</span>
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
