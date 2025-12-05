import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../../assets/ChatGPT Image Nov 29, 2025, 12_24_03 PM.png";

export default function Navbar() {

  const navigate = useNavigate();
  
  const {i18n} = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };


  const { t } = useTranslation();

  const [isTopOfPage, setIsTopOfPage] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsTopOfPage(window.scrollY === 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

  return (
    <header
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        isTopOfPage ? "bg-transparent" : "bg-white shadow"
      }`}
    >
      <div className="w-11/12 mx-auto flex items-center justify-between py-4">
        
        <div>
          <h1 className={`text-xl font-bold leading-5 ${isTopOfPage ? "text-white" : ""}`}>
            {/* <img src={logo} alt="Logo" className="h-10 w-10 inline-block mr-2" /> */}

            Smart Agriculture Market <br /> Management System
          </h1>
        </div>

       
        <nav>
          <ul className="flex items-center gap-10 text-sm font-medium">
       <li>
          <Link
            to="/"
            className={`relative px-3 py-1 text-sm font-medium group
              ${isTopOfPage ? "text-white" : ""} 
              hover:${isTopOfPage ? "text-white" : "text-green-700"}
            `}
          >
            {t('Home')}

            <span
              className={`absolute left-0 bottom-0 h-[2px] w-0 
                transition-all duration-300 group-hover:w-full
                ${isTopOfPage ? "bg-white" : "bg-green-700"}
              `}
            ></span>
          </Link>
      </li>



        <li>
          <Link
            to="/contactus"
            className={`relative px-3 py-1 text-sm font-medium group
              ${isTopOfPage ? "text-white" : ""} hover:${isTopOfPage ? "text-white" : "text-green-700"}
            `}
          >
            {t('About Us')}

            <span
              className={`absolute left-0 bottom-0 h-[2px] w-0 
              transition-all duration-300 group-hover:w-full
              ${isTopOfPage ? "bg-white" : "bg-green-700"}
            `}></span>
          </Link>
        </li>


        <li>
          <Link
            to="/contactus"
            className={`relative px-3 py-1 text-sm font-medium group
              ${isTopOfPage ? "text-white" : ""} hover:${isTopOfPage ? "text-white" : "text-green-700"}
            `}
          >
            {t('Contact Us')}

            <span
              className={`absolute left-0 bottom-0 h-[2px] w-0 
              transition-all duration-300 group-hover:w-full
              ${isTopOfPage ? "bg-white" : "bg-green-700"}
            `}></span>
          </Link>
        </li>

 
          </ul>
        </nav>

       
        <div className="flex items-center gap-4">
      <button
        onClick={() => navigate("/login")}
        className="px-6 py-2 rounded-md bg-custom-green text-white hover:bg-green-800 shadow-md"
      >
        {t('Login')}
      </button>

      <button
        onClick={() => navigate("/signup")}
        className="px-6 py-2 rounded-md border border-gray-400 hover:bg-gray-200"
      >
        {t('Sign Up')}
      </button>
    </div>


        <div className="flex gap-3">
      <button
        onClick={() => changeLanguage("en")}
        className={`relative px-3 py-1 text-sm font-medium group 
          ${isTopOfPage ? "text-white" : ""}
          focus:outline-none focus:ring-0 focus-visible:outline-none
          border border-transparent
        `}
      >
        EN

        <span
          className={`absolute left-0 bottom-0 h-[2px] w-0
            transition-all duration-300 group-hover:w-full
            ${isTopOfPage ? "bg-white" : "bg-green-700"}
          `}
        ></span>
    </button>

    <button
        onClick={() => changeLanguage("si")}
        className={`relative px-3 py-1 text-sm font-medium group 
          ${isTopOfPage ? "text-white" : ""}
          focus:outline-none focus:ring-0 focus-visible:outline-none
          border border-transparent
        `}
      >
        සිං

        <span
          className={`absolute left-0 bottom-0 h-[2px] w-0
            transition-all duration-300 group-hover:w-full
            ${isTopOfPage ? "bg-white" : "bg-green-700"}
          `}
        ></span>
    </button>



      
    </div>


      </div>
    </header>
  );
}