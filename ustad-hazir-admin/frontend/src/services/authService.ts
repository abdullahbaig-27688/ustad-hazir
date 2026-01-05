// import axios from "axios";
// const API_URL = import.meta.env.VITE_API_URL;

// // Register
// const registerAdmin = async (data: any) => {
//   return await axios.post(`${API_URL}/auth/register`, data);
// };

// // Login
// const loginAdmin = async (data: any) => {
//   return await axios.post(`${API_URL}/auth/login`, data);
// };

// // Export both as default object
// export default {
//   registerAdmin,
//   loginAdmin,
// };

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

// Register
const registerAdmin = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// Login
const loginAdmin = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// Logout (optional)
const logout = async () => {
  await signOut(auth);
};

export default {
  registerAdmin,
  loginAdmin,
  logout,
};
