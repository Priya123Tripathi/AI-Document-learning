import axios from "axios";

//send data to the backend--
//Base URL for backend API

const BASE_URL = import.meta.env.VITE_API_URL;



const AUTH_API = axios.create({
  baseURL: `${BASE_URL}/api/auth`,
  timeout: 5000,
});


// Signup function
export const signupUser = async (data) => {
  try {
    const res = await AUTH_API.post("/signup", data);
    //jo token generate kiya ushe localstoage mai store karte hai
    const token =res.data.token;
    localStorage.setItem("token",token);

    return res;
  } catch (error) {
    console.error("Signup Error:", error);
    throw error;
  }
};

//  Login function
export const loginUser = async (data) => {
  try {
    const res = await AUTH_API.post("/login", data);
      localStorage.setItem("token",res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));//taki email ko show karne ke liye use kar sake

    return res;
  } catch (error) {
     console.error(
    "Login Error:",
    error.response?.data || error.message
  );
    throw error;
  }
};
