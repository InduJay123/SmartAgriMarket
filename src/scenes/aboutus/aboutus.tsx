import { motion } from "framer-motion";
import { image, video } from "framer-motion/client";
import { Leaf, Users, Sprout, TrendingUp } from "lucide-react";
import video1 from "../../assets/Video Banner Stock Videos - Rural, Farming, Agriculture, Nature.mp4";
import img from "../../assets/raphael-rychetsky-li9JfUHQfOY-unsplash.jpg";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import nuwan from "../../assets/team/nuwan.png";
import mihitha from "../../assets/team/mihita.jpg";
import iduni from "../../assets/team/iduni.jpg";
import shalin from "../../assets/team/shalin.jpg";
import methsara from "../../assets/team/methsara.jpg";

const Home: React.FC = () => {

  const { t, i18n } = useTranslation();
  const isSinhala = i18n.language === "si";


  return (
    <div className={`w-full -mt-10 overflow-hidden ${isSinhala ?"font-sinhala text-2xl" : "font-sans"}`}>

      {/* HERO SECTION */}
      <section
        className="h-screen w-full  bg-cover bg-center flex items-center justify-center"
       
        >
        <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={video1} type="video/mp4" />
      </video>

      
      <div className="absolute inset-0 bg-black/40 z-0"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-center text-white px-4"
        >
           <p className="text-xl md:text-2xl drop-shadow-md max-w-2xl mx-auto">
                  {t("This is about our")}           </p> 
          <h1 className={`text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg ${isSinhala ?"font-sans" : "font-sans"}`}>
            Smart Agriculture Market Management System
          </h1>
          <p className="mt-4 text-lg max-w-3xl mx-auto drop-shadow-md mt-8">
               
                {t("Smart Agriculture Market Management System is designed to support farmers by providing a modern digital marketplace. Our mission is to help farmers get fair prices, connect with buyers directly, reduce middleman influence, and improve agricultural efficiency across Sri Lanka.")}
                
                      </p>

             <p className="mt-4 text-lg max-w-3xl mx-auto drop-shadow-md">
                   {t("We are committed to building a reliable and user-friendly platform that empowers rural communities, increases transparency, and promotes economic growth in the farming sector.")}
                </p>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-gray-50" id="features">
        <h2 className="text-4xl font-bold text-center mb-10">{t("Our Features")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-20">
          {[
            { icon: Sprout, title: "Smart Crop Pricing", text: t("AI-powered predictions for daily vegetable and fruit prices.") },
            { icon: TrendingUp, title: "Market Insights", text: t("Real-time market demand and supply analytics.") },
            { icon: Leaf, title: "Eco-Friendly Planning", text: t("Reduce food wastage with intelligent forecasting.") },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="bg-white shadow-lg rounded-2xl p-8 text-center border"
            >
              <item.icon className="w-14 h-14 mx-auto text-green-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TIMELINE SECTION */}
     <section
  className="py-20 bg-white bg-cover bg-center"
  id="timeline"
  style={{
        backgroundImage: `url(${img})`,
        filter: "brightness(1)",
  }}
 
>
            


        <h2 className="text-4xl font-bold text-center mb-12 text-white">{t("Our Journey")}</h2>

        <div className="relative border-l-4 border-green-700 max-w-3xl mx-auto px-6">
          {[
            {
            //   year: "2023",
              step: "Idea Born",
              desc: t("We identified the problem of massive vegetable and fruit wastage."),
            },
            {
            //   year: "2024",
              step: "Research & Model",
              desc: t("Machine learning models created to predict daily prices."),
            },
            {
            //   year: "2025",
              step: "Smart System Launch",
              desc: t("Full management system deployed for farmers & buyers."),
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 ml-6"
            >
              <div className="absolute -left-4 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>

              <h3 className="text-2xl font-semibold text-white">{item.step}</h3>
              <p className="text-white">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-20 bg-gray-100" id="team">
        <h2 className="text-4xl font-bold text-center mb-12">{t("Meet Our Team")}</h2>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-20 ${isSinhala ?"font-sans" : "font-sans"}`}>
          {[
            { name: "Mr. Gihan Chathuranga", role: " Supervisor", img: "https://i.pravatar.cc/200?img=1" },
            { name: "Induni Jayamanne", role: "Team Leader / Fullstack Developer", img: iduni },
            { name: "Shalin Nimesh", role: "ML Model Developer", img: shalin },
             { name: "Nuwan Rathnayaka", role: "Fullstack Developer", img: nuwan },
             { name: "Mihitha Bandara", role: "ML Model Developer", img: mihitha },
             { name: "Methsara Malindu", role: "Fullstack Developer", img: methsara },



          ].map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center border"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-4 border-green-500"
              />

              <h3 className="text-2xl font-bold">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer
      className={`bg-custom-green text-white py-14 ${isSinhala ? "font-sans" : "font-sans"}`}
    >
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10">

          {/* Brand Section */}
          <div>
            <h4 className="font-extrabold text-xl leading-tight">
              {t("Smart Agriculture Market Management System")}
            </h4>

            <p className="text-white/90 mt-3 text-sm">
              {t(
                "Empowering farmers with technology, price forecasting, and reliable market insights."
              )}
            </p>

            {/* Social Links */}
            <div className="flex gap-4 mt-5">
              <a className="hover:text-yellow-300 transition">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a className="hover:text-yellow-300 transition">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a className="hover:text-yellow-300 transition">
                <i className="fab fa-twitter text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold text-lg mb-3 border-b border-white/40 pb-1">
              {t("Quick Links")}
            </h5>
            <ul className="text-sm text-white/90 space-y-2">
              <li className="hover:text-yellow-300 cursor-pointer transition"><Link to="/">Home</Link></li>
              <li className="hover:text-yellow-300 cursor-pointer transition">
                <Link to="/">Products</Link>
              </li>
              <li className="hover:text-yellow-300 cursor-pointer transition">
                <Link to="/aboutus"> About Us </Link>
              </li>
              <li className="hover:text-yellow-300 cursor-pointer transition">
                Blog
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h5 className="font-semibold text-lg mb-3 border-b border-white/40 pb-1">
              {t("Support")}
            </h5>
            <ul className="text-sm text-white/90 space-y-2">
              <li className="hover:text-yellow-300 cursor-pointer transition">
                <Link to="/contactus">Contact</Link>
              </li>
              <li className="hover:text-yellow-300 cursor-pointer transition">
                <Link to="/aboutus">Services</Link>
              </li>
              <li className="hover:text-yellow-300 cursor-pointer transition">
                <Link to="/contactus">Help Center</Link>
              </li>
              <li className="hover:text-yellow-300 cursor-pointer transition">
                Careers
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="font-semibold text-lg mb-3 border-b border-white/40 pb-1">
              {t("Contact Information")}
            </h5>

            <ul className="text-sm text-white/90 space-y-3">
              <li className="flex gap-2 items-start">
                <i className="fas fa-map-marker-alt mt-1"></i>
                <span>{t("Matara, Sri Lanka")}</span>
              </li>

              <li className="flex gap-2 items-center">
                <i className="fas fa-envelope"></i>
                <span>support@smartagri.lk</span>
              </li>

              <li className="flex gap-2 items-center">
                <i className="fas fa-phone-alt"></i>
                <span>+94 71 234 5678</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer Strip */}
        <div className="mt-10 border-t border-white/20 pt-5 text-center text-sm text-white/80">
          © {new Date().getFullYear()} Smart Agriculture Market Management System.
          {t("All Rights Reserved.")}.
        </div>
      </footer>
    </div>

    


  );
};

export default Home;
