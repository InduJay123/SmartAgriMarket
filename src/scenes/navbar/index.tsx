import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link to={link.path} className="hover:text-green-700">
              {link.name}
            </Link>
          </li>
        ))}
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
