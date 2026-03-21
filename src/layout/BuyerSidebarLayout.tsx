import { useEffect, useState} from "react";
import { Menu, User, TrendingUp,Search, Bell } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/buyer/Sidebar";
import { getBuyerProfile } from "../api/profile";

const BuyerSideBarLayout: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [buyer, setBuyer] = useState<{ fullname: string; profile_image: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchBuyer = async () => {
    const data = await getBuyerProfile();
    setBuyer({
      fullname: data?.buyer_details?.fullname,
      profile_image: data?.buyer_details?.profile_image,
    });
  };
  fetchBuyer();
}, []);

  return (
    <div className="w-screen bg-gray-50 flex flex-col justify-between">
      {/* NAVBAR */}
      <header className="bg-white shadow-sm sticky top-0 z-40 px-4">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu size={24} />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Buyer Portal</h1>
                  <p className="text-xs text-gray-500">{buyer?.fullname || "Buyers Portal"}</p>
                </div>
              </div>
            </div>

            {/* CENTER: SEARCH */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for vegetables, fruits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* RIGHT: Account + Cart */}
            <div className="flex items-center gap-4">
               <button
                onClick={() => navigate("/buyer/alerts")}
                className="relative p-2 rounded-lg hover:bg-gray-100"
                title="Alerts"
              >
                <Bell size={22} className="text-gray-700" />

                {/* optional red dot (show when there are unseen alerts) */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
               <button 
                onClick={() => navigate("/buyer/profile")}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                {buyer?.profile_image ? (
                  <img
                    src={buyer.profile_image}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <User size={20} />
                )}
                <span className="text-sm font-medium">{buyer?.fullname || "Account"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <div className="flex flex-1 min-h-0">
        <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
        <main className="flex-1 overflow-auto min-h-0 ml-10 pr-40">
          <Outlet />
        </main>
      </div>   
    </div>
  );
};

export default BuyerSideBarLayout;