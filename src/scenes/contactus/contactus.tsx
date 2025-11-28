import React from "react";
import video from "../../assets/Video Banner Stock Videos - Rural, Farming, Agriculture, Nature.mp4";

export default function ContactUs() {
  return (
    <section className="relative w-screen min-h-screen py-20 md:py-28 overflow-hidden">

     
       <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={video} type="video/mp4" />
      </video>

      
      <div className="absolute inset-0 bg-black/40 z-0"></div>

     {/* main */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
        
       
        <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg text-custom-green text-stroke-white ">
          About Us
        </h1>

        <p className="mt-4 text-lg max-w-3xl mx-auto drop-shadow-md">
          Smart Agriculture Market Management System is designed to support 
          farmers by providing a modern digital marketplace. Our mission is to 
          help farmers get fair prices, connect with buyers directly, reduce 
          middleman influence, and improve agricultural efficiency across Sri Lanka.
        </p>

        <p className="mt-4 text-lg max-w-3xl mx-auto drop-shadow-md">
          We are committed to building a reliable and user-friendly platform 
          that empowers rural communities, increases transparency, and promotes 
          economic growth in the farming sector.
        </p>

        <div className="mt-16 bg-green-50/90 opacity-90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 md:p-14 text-gray-900">
          <h2 className="text-3xl font-bold text-custom-green mb-6 text-center">
            Contact Us
          </h2>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-8">

           
            <div className="flex flex-col text-left">
              <label className="font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-700"
                placeholder="Enter your name"
              />
            </div>

           
            <div className="flex flex-col text-left">
              <label className="font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-700"
                placeholder="Enter your email"
              />
            </div>

           
            <div className="flex flex-col text-left md:col-span-2">
              <label className="font-semibold text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-700"
                placeholder="Write your subject"
              />
            </div>

            
            <div className="flex flex-col text-left md:col-span-2">
              <label className="font-semibold text-gray-700 mb-2">Message</label>
              <textarea
                className="p-3 h-32 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-700"
                placeholder="Write your message here..."
              ></textarea>
            </div>

         
            <div className="md:col-span-2 flex justify-center">
              <button className="mt-4 bg-custom-green text-white px-10 py-3 rounded-2xl font-semibold text-lg shadow-lg hover:bg-green-800">
                Send Message
              </button>
            </div>
          </form>
        </div>

       
        <div className="mt-10 text-md text-white drop-shadow-lg">
          <p>
            Email: <span className="text-blue-300 font-semibold">support@smartagri.lk</span>
          </p>
          <p className="mt-1">
            Phone: <span className="text-blue-300 font-semibold">+94 71 234 5678</span>
          </p>
          <p className="mt-1">Location: Mathara, Sri Lanka</p>
        </div>
      </div>
    </section>
  );
}
