import React, { useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminLoginProps {
  onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onClose(); 
      navigate("/admin/dashboard");
    }, 1500);
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose} 
    >
      {/* Modal box */}
      <div
        className="relative w-full max-w-md bg-background/90 p-8 rounded-3xl backdrop-blur-xl border border-white/10 animate-fade-slide-up"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl font-bold hover:border-none"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex items-center gap-3 px-3 py-2 mt-1 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md">
            <User className="text-green-400 w-5" />
            <input
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="bg-transparent focus:outline-none w-full text-white"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-3 px-3 py-2 mt-1 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md">
            <Lock className="text-green-400 w-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="bg-transparent focus:outline-none w-full text-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-green-400"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl mt-4 transition-all"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
