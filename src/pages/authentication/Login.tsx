import { useState } from "react";
import { User, Lock } from "lucide-react";
import type { LoginFormData, UserRole } from "../../types/auth";
import RoleSelector from "../../components/authentication/RoleSelector";
import marketImg from "../../assets/legumes-frais-1140x510.png" 
import { useNavigate } from "react-router-dom";
import {  setAuthToken } from "../../api/api";
import { loginUser } from "../../api/auth";


interface LoginProps {
  onNavigateToSignup: () => void;
}

export default function Login({ onNavigateToSignup }: LoginProps) {
   const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    role: "farmer",
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.email || !formData.password) {
    setErrors({
      email: !formData.email ? "Email is required" : undefined,
      password: !formData.password ? "Password is required" : undefined,
    });
    return;
  }

  try {
    const response = await loginUser({
      email: formData.email,
      password: formData.password,
      role: formData.role === "farmer" ? "Farmer" : "Buyer"
    });

    console.log("Login successful:", response.data);

    // store tokens
    localStorage.setItem("accessToken", response.data.access);
    localStorage.setItem("refreshToken", response.data.refresh);
    localStorage.setItem("userRole", response.data.user.role);

    // set auth token for future requests
    setAuthToken(response.data.access);

    // redirect
    switch (response.data.user.role) {
      case "Farmer":
        navigate("/farmer/dashboard");
        break;
      case "Buyer":
        navigate("/buyer/shop");
        break;
      case "Admin":
        navigate("/admin/dashboard");
        break;
      default:
        alert("Invalid role");
    }

  } catch (error: any) {
    console.error(error.response?.data || error.message);
    alert("Login failed: " + JSON.stringify(error.response?.data));
  }
};
const handleLogin = async () => {
  try {
    const response = await loginUser({ email, password, role });
    const user = response.data.user;

    console.log("Logged in user:", user);
    // user.profile contains the relevant details
    if(user.role === "Farmer"){
      console.log("Farm Name:", user.profile.farm_name);
    } else {
      console.log("Buyer City:", user.profile.city);
    }

  } catch (error) {
    console.error(error);
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
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email}
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
              type="submit"
              onClick={handleLogin}
              disabled={!formData.email || !formData.password}
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
