import api, { setAuthToken } from "./api";

interface LoginData {
  email: string;
  password: string;
  role: "Farmer" | "Buyer";
}

interface SignupData {
  fullname: string;
  username: string;
  email: string;
  password: string;
  role: "Farmer" | "Buyer";
  contact_number: string;
  farm_name?: string;
}

// SIGNUP
export const signupUser = async (data: SignupData) => {
  return await api.post("/signup/", data);
};

// LOGIN
export const loginUser = async (data: LoginData) => {
  setAuthToken(null);
  const response = await api.post("/login/", data);

  // Save tokens
  localStorage.setItem("accessToken", response.data.access);
  localStorage.setItem("refreshToken", response.data.refresh);
  localStorage.setItem("userRole", response.data.user.role);

  // Set token for future requests
  setAuthToken(response.data.access);

  return response;
};
