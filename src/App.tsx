import React from 'react'
import { BrowserRouter,Routes, Route, useNavigate } from 'react-router-dom';

import PublicLayout from './layout/PublicLayout';
import Home from './scenes/home';
import ContactUs from './scenes/contactus/contactus';
import AboutUs from './scenes/aboutus/aboutus';

import Login from './pages/authentication/Login';
import Signup from './pages/authentication/Signup';

import BuyerSideBarLayout from './layout/BuyerSidebarLayout';

import Admin from './pages/admin/Admin';
import AIModel from './pages/admin/AIModel';
import ManageBuyers from './pages/admin/ManageBuyers';
import ManageCrops from './pages/admin/ManageCrops';
import ManageFarmers from './pages/admin/ManageFarmers';
import Reports from './pages/admin/Reports';
import UploadPrice from './pages/admin/UploadPrice';

import AddCrops from './pages/farmer/AddCrops';
import AiInsights from './pages/farmer/AiInsights';
import FarmerDashboard from './pages/farmer/FarmerDashboard';

import FarmerProfileInfo from './pages/farmer/FarmerProfileInfo';
import Settings from './pages/admin/Settings';

import './App.css'

import AdminLanding from './pages/AdminLanding';

import FavouritesPage from './pages/buyer/FavouritesPage';
import OrderHistory from './pages/buyer/OrderHistory';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import ProfileInfo from './pages/buyer/ProfileInfo';
import PriceList from './pages/buyer/PriceList';
import SidebarLayout from './layout/SidebarLayout';
import ResetPassword from './pages/authentication/ResetPassword';
import ScrollToTop from './scenes/navbar/ScrollTop';
import BuyerMessages from './components/buyer/BuyerMessages';
import DashboardLayout from './pages/farmer/DashboardLayout';

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
      <ScrollToTop/>
      <Routes>
        <Route path='/' element = {<Home/>} />
        <Route path='/farmer' element = {<SidebarLayout/>} >
          <Route path="dashboard" element={
                <DashboardLayout>
                  <FarmerDashboard />
                </DashboardLayout>}/>
          <Route path='analytics' element={<AiInsights/>} />
          <Route path='addcrops' element={<AddCrops/>}/>
          <Route path='pricelist' element={<PriceList />}/>
          <Route path='profile' element={<FarmerProfileInfo/>}/>
        </Route>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="contactus" element={<ContactUs />} />
          <Route path="aboutus" element={<AboutUs />} />
          <Route path='login' element={<LoginWrapper/>} />
          <Route path="signup" element={<SignupWrapper />} />
        </Route>
         <Route path="/reset-password/:token" element={<ResetPassword />} />
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
          <Route path="shop" element={<BuyerDashboard />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="favourites" element={<FavouritesPage />} />  
          <Route path="pricelist" element={<PriceList />} />
          <Route path="messages" element={<BuyerMessages/>} />                 
          <Route path="profile" element={<ProfileInfo buyerId={''}/>} />
         </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );

}

export default App;
