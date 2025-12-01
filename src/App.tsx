import React from 'react'
import { useState } from 'react';
import Login from './pages/authentication/Login';
import Signup from './pages/authentication/Signup';
import Home from './scenes/home';
// import Navbar from './scenes/navbar/Navbar';
import ContactUs from './scenes/contactus/contactus';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import BillingInfo from './components/buyer/BillingInfo';
import BuyerShop from './components/buyer/BuyerDashboard';
import OrderHistory from './components/buyer/OrderHistory';
import BuyerSideBarLayout from './layout/BuyerSidebarLayout';
import SideBarLayout from './layout/SidebarLayout';
import Admin from './pages/admin/Admin';
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
import Settings from './pages/admin/Settings';

type Page = 'login' | 'signup';


function App() {

  const [isTopOfPage, setIsTopOfPage] = React.useState(true);

  const [currentPage, setCurrentPage] = useState<Page>('login');

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
    <div>
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
        <Route path="/buyer" element={<BuyerSideBarLayout/>}>
          <Route path="shop" element={<BuyerShop />} />
          <Route path="orders" element={<OrderHistory buyerId={''} />} />
          <Route path="billing" element={<BillingInfo buyerId={''} />} />          
        </Route>
      </Routes>
    </BrowserRouter>

      {currentPage === 'login' ? (
        <Login onNavigateToSignup={() => setCurrentPage('signup')} />
      ) : (
        <Signup onNavigateToLogin={() => setCurrentPage('login')} />
      )}
    </div>
  );
}

export default App;
