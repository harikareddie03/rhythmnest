
const express = require("express");
const User = require("../Models/User");
const { generateToken } = require("../helper/generateToken");
const jsonWeb = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcryptjs");
const verifyToken = require("../middlewares/authMiddleware");

router.post("/login", async (req, res) => {

  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) {
      user = await User.findOne({ email: username });
    }

    if (!user) {
      return res.json({ success: false, message: "Invalid Credentials" });
    } else {
      const verify = await bcrypt.compare(password, user.password);
      if (!verify)
        return res.json({ success: false, message: "Invalid Credentials" });
      else {
        let token = await generateToken(user._id);

        return res.json({
          success: true,
          token,
          user,
          message: "login successful",
        });
      }
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

router.post("/register", async (req, res) => {
  const { email, username, password, DOB, gender } = req.body;
  if (!email || !username || !password || !DOB || !gender)
    return res.json({ success: false, message: "All fields are required" });
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hash,
      DOB,
      gender,
    });
    if (user) {
      let token = await generateToken(user._id);

      res.json({ success: true, message: "User Created", user, token });
    } else {
      res.json({ success: false, message: "Some error creating Account" });
    }
  } catch (error) {
    res.json({ success: false, message: "internal server error" });
  }
});
router.get("/me", async (req, res) => {
  try {
    const { token } = req.headers;
    if (!token)
      return res
        .status(401)
        .json({ success: true, message: "user Unauthorized" });

    const data = jsonWeb.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(data.id);
    if (user) {
      return res.json({ user, success: true, message: "user found" });
    } else {
      return res.status(404).json({ success: true, message: "user not found" });
    }
  } catch (error) {
    res.json({
      success: false,
      message: "session has expire please login again",
    });
  }
});
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json({ users, success: true, message: "users found" });
});


router.get("/profile", verifyToken, async (req, res) => {
  try {
    // Use the user ID from the token (added by the middleware)
    const user = await User.findById(req.user.id);
    console.log("getprofile", user);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Respond with user details
    return res.status(200).json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        DOB: user.DOB,
        gender: user.gender,
      },
      playlists: user.playlists || [], // Assuming playlists are part of the user document
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.put("/update", verifyToken, async (req, res) => {
  try {
    const { username, email, phone, gender } = req.body;

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, email, phone, gender },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;