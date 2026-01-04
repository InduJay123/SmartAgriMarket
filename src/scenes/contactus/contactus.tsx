import React from "react";
import video from "../../assets/Video Banner Stock Videos - Rural, Farming, Agriculture, Nature.mp4";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function ContactUs() {
    const { t, i18n } = useTranslation();
    const isSinhala = i18n.language === "si";

  return (
    <><section className={`relative w-screen -mt-10 min-h-screen py-20 md:py-28 overflow-hidden ${isSinhala ? "font-sinhala text-2xl" : "font-sans"}`}>

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={video} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">

        {/* Contact Form Card */}
        <div className="mt-16 bg-green-50/40 opacity-80 backdrop-blur-lg rounded-3xl shadow-2xl border border-black p-8 md:p-12 text-gray-900">
          <h2 className="text-3xl font-bold text-custom-green mb-6 text-center">
            {t("Get in Touch With Us")}
          </h2>

          <p className="text-gray-700 text-md mb-6 max-w-3xl mx-auto">
            {t("Have questions about our system, partnership opportunities, or technical support?")}
            {t(" We’re here to help you!")}
            {t("Fill out the form below, and our team will contact you within 24–48 hours.")}
          </p>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Full Name */}
            <div className="flex flex-col text-left">
              <label className="font-semibold text-gray-700 mb-2">{t("Full Name")}</label>
              <input
                type="text"
                className="py-2 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-700"
                placeholder={t("Enter your name")} />
            </div>

            {/* Email */}
            <div className="flex flex-col text-left">
              <label className="font-semibold text-gray-700 mb-2">{t("Email Address")}</label>
              <input
                type="email"
                className="py-2 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-700"
                placeholder={t("Enter your email")} />
            </div>

            {/* Subject */}
            <div className="flex flex-col text-left md:col-span-2">
              <label className="font-semibold text-gray-700 mb-2">{t("Subject")}</label>
              <input
                type="text"
                className="py-2 px-4  border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-700"
                placeholder={t("Write your subject")} />
            </div>

            {/* Message */}
            <div className="flex flex-col text-left md:col-span-2">
              <label className="font-semibold text-gray-700 mb-2">{t("Message")}</label>
              <textarea
                className="py-2 px-4 h-30 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-700"
                placeholder={t("Write your message here...")}
              ></textarea>
            </div>

            {/* Button */}
            <div className="md:col-span-2 flex justify-center">
              <button className="mt-4 bg-custom-green text-white px-10 py-3 rounded-2xl font-semibold text-lg shadow-lg hover:bg-green-800">
                {t("Send Message")}
              </button>
            </div>
          </form>
        </div>

        {/* Contact Details */}
        <div className={`mt-12 text-md text-white drop-shadow-lg space-y-2 text-xs ${isSinhala ? 'font-sans' : 'font-sans'}`}>
          <p>
            <span className="font-semibold text-custom-green">Customer Support:</span>{" "}
            support@smartagri.lk
          </p>

          <p>
            <span className="font-semibold text-custom-green">Hotline:</span>{" "}
            +94 71 234 5678
          </p>

          <p>
            <span className="font-semibold text-custom-green">Office Address:</span>{" "}
            Matara, Sri Lanka
          </p>

          <p className="mt-3 text-sm text-gray-200 max-w-xl mx-auto">
            Our support team is available Monday to Friday from 8:30 AM to 5:30 PM.
            We aim to support farmers, buyers, and administrators with a smooth platform experience.
          </p>
        </div>
      </div>

    </section><footer
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
      </footer></>
   
  );
}
