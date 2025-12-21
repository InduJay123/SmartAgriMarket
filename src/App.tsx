import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BillingInfo from './pages/buyer/BillingInfo';
import BuyerSideBarLayout from './layout/BuyerSidebarLayout';
import FavouritesPage from './pages/buyer/FavouritesPage';
import OrderHistory from './pages/buyer/OrderHistory';
import BuyerDashboard from './pages/buyer/BuyerDashboard';

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
          <Route path="shop" element={<BuyerDashboard />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="billing" element={<BillingInfo buyerId={''} />} />
          <Route path="favourites" element={<FavouritesPage />} />          
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
