import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

// Register
const registerAdmin = async (data: any) => {
  return await axios.post(`${API_URL}/auth/register`, data);
};

// Login
const loginAdmin = async (data: any) => {
  return await axios.post(`${API_URL}/auth/login`, data);
};

// Export both as default object
export default {
  registerAdmin,
  loginAdmin,
};
