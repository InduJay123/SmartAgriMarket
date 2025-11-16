import React from "react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <section
      id="home"
      className="w-full h-full bg-gradient-to-b from-blue-100 to-white py-20 md:py-32"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 text-center md:flex-row md:justify-between md:text-left">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <h1 className="text-4xl font-extrabold leading-tight text-blue-600 md:text-5xl">
            Welcome to <span className="text-blue-800">React World</span>
          </h1>

          <p className="mt-4 text-lg text-gray-700 md:mt-6">
            Your journey to fitness starts here. Join us to achieve your health goals
            with expert trainers, modern facilities, and a motivating environment.
          </p>

          <button className="mt-6 rounded-2xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl">
            Click Me
          </button>
        </motion.div>

        {/* Right Side Text Instead of Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-10 md:mt-0 max-w-sm text-center md:text-left"
        >
          <h2 className="text-3xl font-bold text-blue-700">Build Your Best Version</h2>
          <p className="mt-3 text-gray-600 text-lg">
            Unlock your potential with consistency, discipline, and the right guidance.
            Let's grow stronger together — one step at a time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
