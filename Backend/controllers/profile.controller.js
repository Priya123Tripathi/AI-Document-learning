import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const me=async(req,res,next)=>{
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    console.log("BODY:", req.body);
   const {currentPassword , newPassword}=req.body;

      if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user= await User.findById(req.user.id).select("+password");

   if(!user){
   return res.status(401).json({msg :"user not found"})
   }

   const ismatch=await bcrypt.compare(currentPassword.trim(),user.password);


   if(!ismatch){
    return res.status(401).json({msg:"current password is wrong"});

   }
  const hashedPassword=await bcrypt.hash(newPassword,10);
  user.password=hashedPassword;

  await user.save();

  res.json({message :"password update successfully"});

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

