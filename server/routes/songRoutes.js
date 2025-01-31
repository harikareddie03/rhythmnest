const express = require("express");
const multer = require("multer");
const path = require("path");
const Song = require("../Models/Song");
const isAuthenticated = require("../middlewares/auth");

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Store files in "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file
    },
});

const upload = multer({ storage });

// ==========================
// 🎵 POST: Add a New Song (Admin Only)
// ==========================
router.post("/add", isAuthenticated, upload.single("song"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No song file uploaded" });
        }

        const { title, artist, album, genre } = req.body;
        if (!title || !artist || !album || !genre) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const songUrl = `/uploads/${req.file.filename}`;

        const newSong = new Song({ title, artist, album, genre, songUrl });
        await newSong.save();

        res.status(201).json({ success: true, message: "Song added successfully", song: newSong });
    } catch (error) {
        console.error("Error adding song:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
});

// ==========================
// 🎶 GET: Fetch All Songs
// ==========================
router.get("/", async (req, res) => {
    try {
        const songs = await Song.find();
        res.status(200).json({ success: true, songs });
    } catch (error) {
        console.error("Error fetching songs:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
});

// ==========================
// ▶️ POST: Play a Song
// ==========================
router.post("/playSong", isAuthenticated, async (req, res) => {
    try {
        res.status(200).json({ success: true, message: "Song is playing" });
    } catch (error) {
        console.error("Error playing song:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
});

module.exports = router;
