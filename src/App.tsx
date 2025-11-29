import React from 'react'
import './App.css'
import BuyerDashboard from './components/buyer/BuyerDashboard'



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
    <BuyerDashboard/>

    </div>
 

  )
}

export default App
