import React from 'react'
import './App.css'
import Home from './scenes/home'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SidebarLayout from './layout/SidebarLayout';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import AiInsights from './pages/farmer/AiInsights';
import AddCrops from './pages/farmer/AddCrops';
import Settings from './pages/farmer/Settings';


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
        <Route path='/' element = {<Home/>} />
        <Route path='/farmer' element = {<SidebarLayout/>} >
          <Route path='dashboard' element = {<FarmerDashboard/>}/>
          <Route path='analytics' element={<AiInsights/>} />
          <Route path='addcrops' element={<AddCrops/>}/>
          <Route path='settings' element={<Settings/>}/>
        </Route>
      </Routes>
   </BrowserRouter>
 
    
  )
}

export default App
