import { useState } from "react";
import { ArrowRight, Leaf, Sprout, Wheat } from "lucide-react";
import heroImage from "../assets/smart-farming.jpg";
import AdminLogin from "./AdminLogin";

const AdminLanding: React.FC = () => {
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <section className="relative min-h-screen text-white w-screen flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Lush green agricultural farm"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="particle particle-1">
            <Leaf className="w-6 h-6 text-primary-foreground/20" />
          </div>
          <div className="particle particle-2">
            <Wheat className="w-8 h-8 text-primary-foreground/15" />
          </div>
          <div className="particle particle-3">
            <Sprout className="w-5 h-5 text-primary-foreground/20" />
          </div>
          <div className="particle particle-4">
            <Leaf className="w-7 h-7 text-yellow-300/90" />
          </div>
          <div className="particle particle-5">
            <Wheat className="w-6 h-6 text-primary-foreground/15" />
          </div>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-yellow-900/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-primary-foreground/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        <div className="max-w-3xl animate-fade-up">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl backdrop-blur-sm bg-white/20 flex items-center justify-center border border-primary-foreground/30 shadow-glow">
              <Leaf className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <span className="text-2xl font-display font-bold text-green-500 block">
                Agriculture Department
              </span>
              <span className="text-sm text-primary-foreground/80">Sri Lanka</span>
            </div>
          </div>

          <span className="inline-block px-5 py-2.5 bg-primary-foreground/10 backdrop-blur-md rounded-full text-primary-foreground text-sm font-semibold mb-8 border border-primary-foreground/20 animate-shimmer">
            🌾 Smart Digital Agriculture Initiative
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-primary-foreground leading-tight mb-8">
            Driving Growth the green way
            <span className="block text-3xl text-gray-200 mt-8">
              Agri Market Management System
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl">
            Empowering farmers, regulating markets, and ensuring food security
            through digital transformation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="group bg-blue-800 py-2 px-6 text-white rounded-lg flex items-center gap-2 w-fit"
            >
              Admin Portal
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>

            
              <div className="border border-white py-2 px-4 text-white rounded-lg w-fit">
                Let's Start
              </div>
            
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>

      {/* Render Login Modal */}
      {isLoginOpen && <AdminLogin onClose={() => setIsLoginOpen(false)} />}
    </section>
  );
};

export default AdminLanding;
