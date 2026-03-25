import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//for signup
export const signup = async (req, res,next) => {
  try {
    const { name, email, password } = req.body;

    const cleanpassword=password.trim();

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, password) are required.",
      });
    }

    //  Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    //  Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(cleanpassword,salt);

    //  Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

 
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //response send to user
    res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("full Error:", error);
    res.status(500).json({
      success: false,
      message: "Signup failed due to server error.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

//login

export const login = async (req, res,next) => {

  try {
    
    const { email, password } = req.body;
 const cleanpassword=password.trim();
  
  
    //  Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    //  Find user by email
    const user = await User.findOne({ email }).select("+password"); // ensure password is fetched

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    //  Compare password
    const isMatch = await bcrypt.compare(cleanpassword, user.password);
    console.log("password match",isMatch);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    //  Generate JWT token
      const token = jwt.sign(
      { id: user._id, email: user.email }, //payload hai user identity pehchanane ke liye
      process.env.JWT_SECRET,
      { expiresIn: "7d"}
    );
  console.log(token);
    //  Respond with token and user info to frontend
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Login failed due to server error.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};



