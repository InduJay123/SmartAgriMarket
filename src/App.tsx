import React from 'react'
import './App.css'
import Home from './scenes/home'
import Navbar from './scenes/navbar'
import Admin from './pages/admin/Admin';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/admin/AdminDashboard';
import AIModel from './pages/admin/AIModel';
import ManageBuyers from './pages/admin/ManageBuyers';
import ManageCrops from './pages/admin/ManageCrops';
import ManageFarmers from './pages/admin/ManageFarmers';
import Reports from './pages/admin/Reports';
import UploadPrice from './pages/admin/UploadPrice';
import AddCrops from './pages/farmer/AddCrops';
import AiInsights from './pages/farmer/AiInsights';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import Messages from './pages/farmer/Messages';
import Settings from './pages/farmer/Settings';
import SideBarLayout from './layout/SidebarLayout';

function App() {

  const [isTopOfPage, setIsTopOfPage] = React.useState(true);
  
  React.useEffect(() => {
    const handleScroll = () => {
      if(window.scrollY === 0 ) {
        setIsTopOfPage(true);
      } else {
        setIsTopOfPage(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [] 
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/farmer" element={<SideBarLayout />}>
          <Route path='dashboard' element={<FarmerDashboard/>} />
          <Route path="ai-insights" element={<AiInsights />} />
          <Route path="addcrops" element={<AddCrops />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
        </Route>

         <Route path="/admin" element={<Admin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="farmers" element={<ManageFarmers />} />
          <Route path="buyers" element={<ManageBuyers />} />
          <Route path="crops" element={<ManageCrops />} />
          <Route path="upload" element={<UploadPrice />} />
          <Route path="reports" element={<Reports />} />
          <Route path="ai" element={<AIModel />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;