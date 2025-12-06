import React from "react";
import video from "../../assets/Video Banner Stock Videos - Rural, Farming, Agriculture, Nature.mp4";

export default function ContactUs() {
  return (
    <section className="relative w-screen -mt-10 min-h-screen py-20 md:py-28 overflow-hidden">

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
        <div className="mt-16 bg-green-50/90 opacity-90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 md:p-14 text-gray-900">
          <h2 className="text-3xl font-bold text-custom-green mb-6 text-center">
            Get in Touch With Us
          </h2>

          <p className="text-gray-700 text-lg mb-8 max-w-3xl mx-auto">
            Have questions about our system, partnership opportunities, or technical support?  
            We’re here to help you!  
            Fill out the form below, and our team will contact you within 24–48 hours.
          </p>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Full Name */}
            <div className="flex flex-col text-left">
              <label className="font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-700"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col text-left">
              <label className="font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-700"
                placeholder="Enter your email"
              />
            </div>

            {/* Subject */}
            <div className="flex flex-col text-left md:col-span-2">
              <label className="font-semibold text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-700"
                placeholder="Write your subject"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col text-left md:col-span-2">
              <label className="font-semibold text-gray-700 mb-2">Message</label>
              <textarea
                className="p-3 h-32 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-700"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            {/* Button */}
            <div className="md:col-span-2 flex justify-center">
              <button className="mt-4 bg-custom-green text-white px-10 py-3 rounded-2xl font-semibold text-lg shadow-lg hover:bg-green-800">
                Send Message
              </button>
            </div>
          </form>
        </div>

        {/* Contact Details */}
        <div className="mt-12 text-md text-white drop-shadow-lg space-y-2">
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
    </section>
  );
}
