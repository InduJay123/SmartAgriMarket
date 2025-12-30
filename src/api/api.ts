import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/auth";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Set Authorization header for future requests
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Load token from localStorage on page reload
const token = localStorage.getItem("accessToken");
if (token) setAuthToken(token);

export default api;
