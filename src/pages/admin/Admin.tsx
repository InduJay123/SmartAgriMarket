import { useEffect, useState } from "react";
import { Menu, X, User } from "lucide-react";
import api from "../../api/api";

import AdminDashboard from "./AdminDashboard";
import ManageFarmers from "./ManageFarmers";
import ManageBuyers from "./ManageBuyers";
import ManageCrops from "./ManageCrops";
import UploadPrice from "./UploadPrice";
import Reports from "./Reports";
import Settings from "./Settings";
import Sidebar from "../../components/admin/Sidebar";
import AiInsights from "../farmer/AiInsights";


const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [adminDisplayName, setAdminDisplayName] = useState("Admin");

  const fetchAdminSettings = async () => {
    try {
      const res = await api.get("/auth/admin/settings/");
      const username = res?.data?.username?.trim();
      setAdminDisplayName(username || "Admin");
    } catch (err) {
      console.error("Failed to load admin settings for header:", err);
      setAdminDisplayName("Admin");
    }
  };

  useEffect(() => {
    fetchAdminSettings();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "farmers":
        return <ManageFarmers />;
      case "buyers":
        return <ManageBuyers />;
      case "crops":
        return <ManageCrops />;
      case "upload":
        return <UploadPrice />;
      case "reports":
        return <Reports />;
      case "ai":
        return <AiInsights />;
      case "settings":
        return <Settings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-screen">
      {/* z HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Mobile menu button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-12 h-16 flex items-center justify-center">
                  🏢
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
                  <p className="text-xs text-gray-500">Management Panel</p>
                </div>
              </div>
            </div>

            {/* Account Button */}
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <User size={20} />
              <span className="text-sm font-medium">{adminDisplayName}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="w-screen mx-auto px-4 sm:px-6 lg:px-8 py-1">
        <div className="flex gap-6">

          {/* Sidebar (mobile + desktop) */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showMobileMenu={showMobileMenu}
            setShowMobileMenu={setShowMobileMenu}
          />

          {/* MAIN CONTENT */}
          <div className="flex-1 bg-gray-50 shadow-sm p-6 min-h-[80vh]">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
