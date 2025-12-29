import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/farmer";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if exists
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// SIGNUP
export const signupUser = async (data: {
  fullname: string;
  username: string;
  email: string;
  password: string;
  role: "Farmer" | "Buyer";
}) => {
  return await api.post("/signup/", data);
};

// LOGIN
export const loginUser = async (data: { email: string; password: string , role:string}) => {
  return await api.post("/login/", data);
};

// GET PROFILE (protected)
export const getProfile = async (userId: number) => {
  return await api.get(`/${userId}/`);
};

// UPDATE PROFILE
export const updateProfile = async (userId: number, data: any) => {
  return await api.put(`/${userId}/`, data);
};

// DELETE PROFILE IMAGE
export const deleteProfileImage = async (userId: number) => {
  return await api.delete(`/${userId}/delete-image/`);
};

export default api;
