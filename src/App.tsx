import React from 'react'
import './App.css'
import Home from './scenes/home'
import Navbar from './scenes/navbar'
import ContactUs from './scenes/contactus/contactus'
import { BrowserRouter, Routes, Route } from 'react-router-dom'



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
    <div>
    
    <BrowserRouter>
      {/* Navbar always visible */}
      <Navbar />

      {/* Page Routing */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contactus" element={<ContactUs />} />
      </Routes>
    </BrowserRouter>

    </div>
 

  )
}

export default App
