const express = require("express");
const multer = require("multer");
const path = require("path");
const Song = require("../Models/Song");
const verifyToken = require("../middlewares/authMiddleware");
const isAuthenticated = require("../middlewares/auth");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = file.mimetype.startsWith("image/") ? "artistPhotos" : "songs";
        cb(null, `uploads/${folder}`);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

router.post(
    "/add",
    verifyToken,
    isAuthenticated,
    upload.fields([{ name: "songFile" }, { name: "artistPhoto" }]),
    async (req, res) => {
        console.log("hello");
        try {
            if (!req.files || !req.files["songFile"] || !req.files["artistPhoto"]) {
                return res.status(400).json({
                    success: false,
                    message: "Both Song File and Artist Photo are required",
                });
            }

            const { title, artist } = req.body;
            if (!title || !artist) {
                return res.status(400).json({
                    success: false,
                    message: "Both Title and Artist Name are required",
                });
            }

            const songUrl = `/uploads/songs/${req.files["songFile"][0].filename}`;
            const artistPhotoUrl = `/uploads/artistPhotos/${req.files["artistPhoto"][0].filename}`;

            const newSong = new Song({ title, artist, songUrl, artistPhotoUrl });
            await newSong.save();

            res.status(201).json({
                success: true,
                message: "Song added successfully",
                song: newSong,
            });
        } catch (error) {
            console.error(" Error adding song:", error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: error.message,
            });
        }
    }
);

router.get("/", async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: "i" } }, 
                    { artist: { $regex: search, $options: "i" } }, 
                ],
            };
        }

        const songs = await Song.find(query);
        res.status(200).json({ success: true, songs });
    } catch (error) {
        console.error(" Error fetching songs:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error.",
            error: error.message,
        });
    }
});

router.post("/playSong", verifyToken, isAuthenticated, async (req, res) => {
    try {
        res.status(200).json({ success: true, message: "Song is playing" });
    } catch (error) {
        console.error(" Error playing song:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});



module.exports = router;
