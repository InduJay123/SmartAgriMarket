import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BillingInfo from './components/buyer/BillingInfo';
import BuyerShop from './components/buyer/BuyerDashboard';
import OrderHistory from './components/buyer/OrderHistory';
import BuyerSideBarLayout from './layout/BuyerSidebarLayout';

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
        <Route path="/buyer" element={<BuyerSideBarLayout/>}>
          <Route path="shop" element={<BuyerShop />} />
          <Route path="orders" element={<OrderHistory buyerId={''} />} />
          <Route path="billing" element={<BillingInfo buyerId={''} />} />          
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
