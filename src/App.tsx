import React from 'react'
import { useState } from 'react';
import Login from './pages/authentication/Login';
import Signup from './pages/authentication/Signup';
import Home from './scenes/home';
// import Navbar from './scenes/navbar/Navbar';
import ContactUs from './scenes/contactus/contactus';
import { BrowserRouter,Routes, Route } from 'react-router-dom';

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
