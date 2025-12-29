import { useState } from "react";
import { UserPlus, User, Mail, Lock, Phone, MapPin } from "lucide-react";
import RoleSelector from "../../components/authentication/RoleSelector";
import type { SignupFormData, UserRole } from "../../types/auth";
import rightimg from "../../assets/man-seller-sells-fresh-organic-fruit-vegetable-street-shop-seasonal-outdoor-farmer-local-market_575670-344.avif"
import { signupUser } from "../../api";

interface SignupProps {
  onNavigateToLogin: () => void;
}

export default function Signup({ onNavigateToLogin }: SignupProps) {

  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    username: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    role: "farmer",
    farmLocation: "",
  });


  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormData, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SignupFormData, string>> = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Full name is required";

    if (!formData.username.trim())
      newErrors.username = "Username is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    }

    if (!formData.password)
      newErrors.password = "Password is required";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (formData.role === "farmer" && !formData.farmLocation?.trim()) {
      newErrors.farmLocation = "Farm location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await signupUser({
        fullname: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role === "farmer" ? "Farmer" : "Buyer",
      });

      console.log("Signup successful:", response.data);
      alert("Account created successfully!");
      onNavigateToLogin();

    } catch (error: any) {
        console.error(error.response?.data || error.message);
        alert("Signup failed: " + JSON.stringify(error.response?.data));
    }
  };

  return ( 
      <div className="w-full bg-white grid grid-cols-1 md:grid-cols-2 overflow-hidden py-10 px-16">
        {/* LEFT SIDE – SIGNUP FORM */}
        <div className="p-10">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600 mt-1">
            Smart Agriculture Market Management System
          </p>

          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700">
              Select Your Role
            </label>

            <RoleSelector
              selectedRole={formData.role}
              onRoleChange={(role: UserRole) => setFormData({ ...formData, role })}
            />
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">

            {/* FULL NAME */}
            <InputField
              label="Full Name"
              icon={User}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(v: any) => setFormData({ ...formData, fullName: v })}
              error={errors.fullName}
            />

            {/* USERNAME */}
            <InputField
              label="Username"
              icon={User}
              placeholder="Choose a username"
              value={formData.username}
              onChange={(v: any) => setFormData({ ...formData, username: v })}
              error={errors.username}
            />

            {/* EMAIL + PHONE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Email"
                icon={Mail}
                placeholder="Enter your email"
                value={formData.email}
                onChange={(v: any) => setFormData({ ...formData, email: v })}
                error={errors.email}
              />

              <InputField
                label="Mobile Number"
                icon={Phone}
                placeholder="10–15 digits"
                value={formData.mobileNumber}
                onChange={(v: any) => setFormData({ ...formData, mobileNumber: v })}
                error={errors.mobileNumber}
              />
            </div>

            {/* PASSWORD */}
            <InputField
              label="Password"
              icon={Lock}
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(v: any) => setFormData({ ...formData, password: v })}
              error={errors.password}
            />

            {/* CONFIRM PASSWORD */}
            <InputField
              label="Confirm Password"
              icon={Lock}
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(v: any) =>
                setFormData({ ...formData, confirmPassword: v })
              }
              error={errors.confirmPassword}
            />

            {/* FARM LOCATION – only for farmers */}
            {formData.role === "farmer" && (
              <InputField
                label="Farm Location"
                icon={MapPin}
                placeholder="City, District"
                value={formData.farmLocation}
                onChange={(v: any) => setFormData({ ...formData, farmLocation: v })}
                error={errors.farmLocation}
              />
            )}

            <button 
              className="w-full bg-green-600 text-white py-3 rounded-lg shadow hover:bg-green-700 transition">
              <UserPlus className="inline w-5 h-5 mr-2" />
              Sign Up
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4 text-center">
            Already have an account?{" "}
            <button
              onClick={onNavigateToLogin}
              className="text-green-700 font-semibold hover:underline"
            >
              Login
            </button>
          </p>
        </div>

        {/* RIGHT SIDE – Illustration area */}
        <div className="hidden md:flex flex-col  items-center justify-center p-10 ">         
          <h2 className="text-4xl  text-gray-800 leading-snug text-left font-poppins mb-6 -mt-12">
          Reach your<br /> customers faster, <br />
          Manage your<br /> harvest without loss, <br />
          <span className="text-green-700 font-bold">With Us.</span>
        </h2>                  
          <img
            src={rightimg}
            alt="Signup Illustration"
            className="max-w-md w-full"
          />
        </div>
      </div>
  );
}

/* Reusable Input Component */

function InputField({
  label,
  icon: Icon,
  error,
  value,
  onChange,
  type = "text",
  placeholder,
}: any) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-1">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

        <input
          type={type}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-600 
          ${error ? "border-red-500" : "border-gray-300"}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}