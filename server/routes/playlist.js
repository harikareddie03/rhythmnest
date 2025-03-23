const express = require("express");
const Playlist = require("../Models/Playlist");
const router = express.Router();
const Song = require("../Models/Song"); 
const verifyToken = require("../middlewares/authMiddleware");
const isAuthenticated = require("../middlewares/auth");

router.get("/", async (req, res) => {
  try {
    const playlists = await Playlist.find();
    res.json({ playlists, success: true, message: "Playlists found" });
  } catch (error) {
    console.error("❌ Error fetching playlists:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/like", async (req, res) => {
  try {
    const { song_mp3, song_title, song_artist, song_thumbnail } = req.body;

    let playlist = await Playlist.findOne({ title: "Liked Songs" });

    // If "Liked Songs" playlist doesn't exist, create it
    if (!playlist) {
      playlist = new Playlist({ title: "Liked Songs", singers: [], songs: [] });
    }

    // Add song to the playlist
    playlist.songs.push({ song_mp3, song_title, song_artist, song_thumbnail });

    await playlist.save(); // Await save to ensure completion

    res.json({ playlist, success: true, message: "Song liked" });
  } catch (error) {
    console.error("❌ Error liking song:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
router.post("/create-playlist", async (req, res) => {
  console.log("📩 POST /api/playlist/create received");
  try {
    const { title, singers, songs } = req.body;

    console.log("📥 Incoming Payload:", JSON.stringify(req.body, null, 2));

    const newPlaylist = new Playlist({
      title,
      singers,
      songs: songs.map(song => ({
        song_mp3: song.song_mp3,  // This should be the actual URL
        song_title: song.song_title,
        song_artist: song.song_artist,
        song_thumbnail: song.song_thumbnail,
      })),
    });

    await newPlaylist.save();
    console.log("✅ Playlist Saved:", newPlaylist);

    res.json({ success: true, playlist: newPlaylist });
  } catch (error) {
    console.error("❌ Error creating playlist:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const playlists = await Playlist.find();
    res.json({ playlists, success: true, message: "Playlists found" });
  } catch (error) {
    console.error("❌ Error fetching playlists:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate("songs"); // Populate songs

    if (!playlist) {
      return res.status(404).json({ success: false, message: "Playlist not found" });
    }

    res.json({ playlist, success: true });
  } catch (error) {
    console.error("❌ Error fetching playlist:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
module.exports = router;
