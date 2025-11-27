import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Navbar() {

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
            <li><Link to="/" className="hover:text-green-700">{t('Home')}</Link></li>
            <li>
              <Link to="/contactus" className="hover:text-green-700">{t('About Us')}</Link>
            </li>
           
            

                  <li className="relative group cursor-pointer">
                      <button className="inline-flex items-center gap-1 font-medium hover:text-green-700  ">
                       {t('Pages')}
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

        {/* Dropdown Menu */}
                <div className="absolute hidden group-hover:flex flex-col bg-white shadow-md rounded-md w-40 right-0 top-full pt-2">
                  <a href="#" className="px-4 py-2 hover:bg-gray-100 hover:text-green-700">Farmer</a>
                  <a href="#" className="px-4 py-2 hover:bg-gray-100 hover:text-green-700">Buyer</a>
                  <a href="#" className="px-4 py-2 hover:bg-gray-100 hover:text-green-700">Admin</a>
                </div>
      </li>


           
          </ul>
        </nav>

       
        <div className="flex items-center gap-4">
          <button className="px-6 py-2 rounded-md bg-custom-green text-white hover:bg-green-800 shadow-md">
           {t('Login')}
          </button>
          <button className="px-6 py-2 rounded-md border border-gray-400 hover:bg-gray-200">
            {t('Sign Up')}
          </button>
        </div>

        <div className="flex gap-3">
      <button onClick={() => changeLanguage("en")} className="px-3 py-1 border-x-0 border-y-0 hover:bg-gray-200">
        EN
      </button>
      <button onClick={() => changeLanguage("si")} className="px-3 py-1 border-x-0 border-y-0 hover:bg-gray-200 ">
        සිං
      </button>
    </div>


      </div>
    </header>
  );
}
