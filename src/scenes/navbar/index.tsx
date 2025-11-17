import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [isTopOfPage, setIsTopOfPage] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsTopOfPage(window.scrollY === 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        isTopOfPage ? "bg-white shadow-md" : "bg-white shadow"
      }`}
    >
      <div className="w-11/12 mx-auto flex items-center justify-between py-4">
        
        <div>
          <h1 className="text-xl font-bold leading-5">
            Smart Agriculture Market <br /> Management System
          </h1>
        </div>

       
        <nav>
          <ul className="flex items-center gap-10 text-sm font-medium">
            <li><a href="#" className="hover:text-green-700">Home</a></li>
            <li><a href="#" className="hover:text-green-700">About Us</a></li>
            <li><a href="#" className="hover:text-green-700">Pages</a></li>
          </ul>
        </nav>

       
        <div className="flex items-center gap-4">
          <button className="px-6 py-2 rounded-md bg-custom-green text-white hover:bg-green-800 shadow-md">
            Login
          </button>
          <button className="px-6 py-2 rounded-md border border-gray-400 hover:bg-gray-200">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}
