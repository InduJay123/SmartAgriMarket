import { Settings } from 'lucide-react';
import { useState } from 'react';
import Header from '../components/admin/Header';
import AIModel from './AIModel';
import Dashboard from './Dashboard';
import ManageBuyers from './ManageBuyers';
import ManageCrops from './ManageCrops';
import ManageFarmers from './ManageFarmers';
import Reports from './Reports';
import UploadPrice from './UploadPrice';
import Sidebar from '../components/admin/Sidebar';


const Admin:React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'farmers':
        return <ManageFarmers />;
      case 'buyers':
        return <ManageBuyers />;
      case 'crops':
        return <ManageCrops />;
      case 'upload':
        return <UploadPrice />;
      case 'reports':
        return <Reports />;
      case 'ai':
        return <AIModel />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default Admin;
