import React from 'react'
import './App.css'
import Home from './scenes/home'
import Navbar from './scenes/navbar'



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
    
    <Navbar></Navbar>

    <Home></Home>
    </div>
 

  )
}

export default App;