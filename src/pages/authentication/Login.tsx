import { useState } from "react";
import { User, Lock } from "lucide-react";
import type { LoginFormData, UserRole } from "../../types/auth";
import RoleSelector from "../../components/authentication/RoleSelector";
import marketImg from "../../assets/legumes-frais-1140x510.png" 
import { useNavigate } from "react-router-dom";


interface LoginProps {
  onNavigateToSignup: () => void;
}

export default function Login({ onNavigateToSignup }: LoginProps) {
   const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
    role: "farmer",
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<LoginFormData> = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Login submitted:", formData);
  };

   const handleLogin = () => {
      switch(formData.role){
        case "farmer":
          navigate("/farmer/dashboard");
          break;
        case "buyer":
          navigate("/buyer/shop");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          alert("Please select the role..")
      }
    };
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* LEFT SECTION - LOGIN FORM */}
      <div className="flex items-center justify-center px-6 py-2">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-600 mb-8">
            Enter your Credentials to access your account
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ROLE */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Select Your Role
              </label>
              <RoleSelector
                selectedRole={formData.role}
                onRoleChange={(role: UserRole) =>
                  setFormData({ ...formData, role })
                }
              />
            </div>

            {/* USERNAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>

              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end">
              <button className="text-sm text-green-700 hover:text-green-800">
                Forgot password?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              onClick={handleLogin}
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
            >
              Login
            </button>
          </form>

          {/* SIGN UP */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <button
                onClick={onNavigateToSignup}
                className="text-green-700 font-semibold hover:text-green-800"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - IMAGE + TEXT */}
      <div className="hidden md:flex flex-col items-left justify-center bg-white p-2">
        
        <h2 className="text-4xl  text-gray-800 leading-snug text-left font-poppins mb-6">
          Reach your<br /> customers faster, <br />
          Manage your<br /> harvest without loss, <br />
          <span className="text-green-700 font-bold">With Us.</span>
        </h2>

        <img
          src={marketImg}
          alt="vegetable market"
          className="w-100 mb-6"
        />
      </div>
    </div>
  );
}
