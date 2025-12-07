import React from 'react'
import './App.css'
import Admin from './pages/Admin';
import { Route, Routes } from 'react-router-dom';
import AdminLanding from './pages/AdminLanding';

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
    <Routes>     
      <Route path="/" element={<AdminLanding />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}

export default App;