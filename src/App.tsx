import React from 'react'
import { BrowserRouter,Routes, Route, useNavigate } from 'react-router-dom';

import PublicLayout from './layout/PublicLayout';
import Home from './scenes/home';
import ContactUs from './scenes/contactus/contactus';
import AboutUs from './scenes/aboutus/aboutus';

import Login from './pages/authentication/Login';
import Signup from './pages/authentication/Signup';

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

import './App.css'

import AdminLanding from './pages/AdminLanding';

function App() {
  function LoginWrapper() {
    const navigate = useNavigate();
    return <Login onNavigateToSignup={() => navigate("/signup")} />;
  }

  function SignupWrapper() {
    const navigate = useNavigate();
    return <Signup onNavigateToLogin={() => navigate("/login")} />;
  }

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
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="contactus" element={<ContactUs />} />
          <Route path="aboutus" element={<AboutUs />} />
          <Route path='login' element={<LoginWrapper/>} />
          <Route path="signup" element={<SignupWrapper />} /> 
        </Route>

        <Route path="/farmer" element={<SideBarLayout />}>
          <Route path='dashboard' element={<FarmerDashboard/>} />
          <Route path="ai-insights" element={<AiInsights />} />
          <Route path="addcrops" element={<AddCrops />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
        </Route>

         <Route path="/admin" element={<AdminLanding />} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<Admin />} />
        
        <Route path="/admin/farmers" element={<ManageFarmers />} />
        <Route path="/admin/buyers" element={<ManageBuyers />} />
        <Route path="/admin/crops" element={<ManageCrops />} />
        <Route path="/admin/upload" element={<UploadPrice />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/ai" element={<AIModel />} />
        <Route path="/admin/settings" element={<Settings />} />

        <Route path="/buyer" element={<BuyerSideBarLayout/>}>
          <Route path="shop" element={<BuyerShop />} />
          <Route path="orders" element={<OrderHistory buyerId={''} />} />
          <Route path="billing" element={<BillingInfo buyerId={''} />} />          
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );

}

export default App;
