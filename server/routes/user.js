
const express = require("express");
const User = require("../Models/User");
const { generateToken } = require("../helper/generateToken");
const jsonWeb = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcryptjs");
const verifyToken = require("../middlewares/authMiddleware");
const isAuthenticated = require("../middlewares/auth");
const connectDB = require("../db"); 
const { ObjectId } = require("mongodb");
router.post("/login", async (req, res) => {
  const Song = require("../Models/Song"); 

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
    
    const user = await User.findById(req.user.id);
    console.log("getprofile", user);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        DOB: user.DOB,
        gender: user.gender,
      },
      playlists: user.playlists || [], 
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.put("/update", verifyToken, async (req, res) => {
  try {
    const { username, email, phone, gender } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, email, phone, gender },
      { new: true } 
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




router.post("/like", async (req, res) => {
  const { userId, songId } = req.body;

  try {
    const db = await connectDB();
    if (!db) {
      console.error(" Database connection failed");
      return res.status(500).json({ success: false, message: "Database connection failed" });
    }

    if (!ObjectId.isValid(userId) || !ObjectId.isValid(songId)) {
      console.error("Invalid ID format:", { userId, songId });
      return res.status(400).json({ success: false, message: "Invalid userId or songId" });
    }

    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) {
      console.error(" User not found:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isLiked = user.likedSongs && user.likedSongs.some(id => id.toString() === songId);

    if (isLiked) {
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { likedSongs: songId } }
      );
      return res.json({ success: true, isLiked: false });
    } else {
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { likedSongs: songId } }
      );
      return res.json({ success: true, isLiked: true });
    }
  } catch (error) {
    console.error(" Server Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;

router.get("/like",isAuthenticated, async (req, res) => {
  try {
    console.log("🔍 Fetching liked songs for user:", req.user); 

    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const user = await User.findById(req.user.id).populate("likedSongs");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, playlist: { title: "Liked Songs", songs: user.likedSongs } });

  } catch (error) {
    console.error(" Error fetching liked songs:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});
router.get("/like/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;
  console.log("🔍 Fetching liked songs for user:", userId);

  try {
      if (!ObjectId.isValid(userId)) {
          console.error(" Invalid user ID format:", userId);
          return res.status(400).json({ success: false, message: "Invalid user ID" });
      }

      const user = await User.findById(userId).populate("likedSongs");

      if (!user) {
          console.error(" User not found:", userId);
          return res.status(404).json({ success: false, message: "User not found" });
      }

      console.log(" Liked songs fetched:", user.likedSongs);
      res.json({ success: true, likedSongs: user.likedSongs });

  } catch (error) {
      console.error(" Server Error:", error);
      res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
});


module.exports = router;