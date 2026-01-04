import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/reset-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setError("");
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center h-screen">
      <div className="bg-white p-8 m-16 rounded shadow-md border w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label className="block mb-2">New Password</label>
            <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded pr-10"
                placeholder="Enter new password"
            />
            <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/6 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
         </div>

          <div className="mb-4 relative"> 
            <label className="block mb-2">Confirm Password</label>
            
            <input
                type={showConfirm ? "text" : "password"}  // toggle type
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Confirm new password"
            />

            <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-2 top-1/2 transform -translate-y-1/6 text-gray-500"
            >
                {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
        </div>


          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
