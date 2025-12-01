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
        <Route path="/contactus" element={<ContactUs />} />
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
