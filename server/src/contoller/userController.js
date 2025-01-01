const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const { hashPassword } = require("../utils/helpers");
const dotenv = require("dotenv").config();

const createUser =asyncHandler ( async (req , res) =>{
    let { name, email, password}= req.body;
    if(!name || !email || !password){
        return res.status(400).json({
            message: "All feilds are required"
        })
    }
    const check = await User.findOne({email});
    if(check){
        return res.status(400).json({
            message: "User already registered"
        })
    }
    password = hashPassword(password);
    const user = await User.create({
        name,
        email,
        password,
    })

    res.status(201).json(user);
});

const loginUser = asyncHandler( async (req, res) =>{
    const { email, password } = req.body;
  
    try {
      // Find user by email
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Generate JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
})
  
const logoutUser = (req, res) => {
    try {
        res
          .cookie("token", "", {
            httpOnly: true, // Ensure the cookie is inaccessible to client-side scripts
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: new Date(0), // Expire the cookie immediately
          })
          .status(200)
          .json({ message: "Logout successful" });
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
}

const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
}

module.exports = { createUser, loginUser, logoutUser, currentUser };
