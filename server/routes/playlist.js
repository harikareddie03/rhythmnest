const express = require("express");
const Playlist = require("../Models/Playlist");
const router = express.Router();
const Song = require("../Models/Song"); 
const verifyToken = require("../middlewares/authMiddleware");
const isAuthenticated = require("../middlewares/auth");
const User = require("../Models/User"); 

router.get("/", async (req, res) => {
  try {
    
    const playlists = await Playlist.find();
    res.json({ playlists, success: true, message: "Playlists found" });
  } catch (error) {
    console.error(" Error fetching playlists:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
router.delete("/like/:songId", async (req, res) => {
  try {
    const { songId } = req.params;
    let playlist = await Playlist.findOne({ title: "Liked Songs" });

    if (!playlist) {
      return res.status(404).json({ success: false, message: "Liked Songs playlist not found" });
    }
    playlist.songs = playlist.songs.filter((song) => song.toString() !== songId);
    await playlist.save();

    res.json({ success: true, isLiked: false, playlist });
  } catch (error) {
    console.error(" Error unliking song:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
router.post("/like", async (req, res) => {
  try {
    const { song_mp3, song_title, song_artist, song_thumbnail } = req.body;

    let playlist = await Playlist.findOne({ title: "Liked Songs" });
    if (!playlist) {
      playlist = new Playlist({ title: "Liked Songs", singers: [], songs: [] });
    }
    let existingSong = await Song.findOne({ song_mp3 });

    if (!existingSong) {
      existingSong = new Song({ song_mp3, song_title, song_artist, song_thumbnail });
      await existingSong.save();
    }
    if (!playlist.songs.includes(existingSong._id)) {
      playlist.songs.push(existingSong._id);
      await playlist.save();
    }

    res.json({ success: true, isLiked: true, playlist });
  } catch (error) {
    console.error("❌ Error liking song:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

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

    console.log("✅ Liked songs fetched:", user.likedSongs);
    res.json({ success: true, playlist: { title: "Liked Songs", songs: user.likedSongs } });

  } catch (error) {
    console.error("❌ Error fetching liked songs:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});
router.post("/like/:songId", verifyToken, async (req, res) => {
  const { songId } = req.params;
  const userId = req.user.id; 

  try {
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ success: false, message: "Song not found" });
    }

    let playlist = await Playlist.findOne({ title: "Liked Songs", user: userId });

    if (!playlist) {
      playlist = new Playlist({ title: "Liked Songs", user: userId, songs: [] });
    }
    const songExists = playlist.songs.some(id => id.toString() === songId);

    if (songExists) {
      playlist.songs = playlist.songs.filter(id => id.toString() !== songId);
    } else {
      playlist.songs.push(songId);
    }

    await playlist.save();
    res.json({ success: true, isLiked: !songExists, playlist });

  } catch (error) {
    console.error("❌ Error toggling like:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/like/:songId", isAuthenticated, async (req, res) => {
  const { songId } = req.params;

  try {
      const song = await Song.findById(songId);
      if (!song) {
          return res.status(404).json({ success: false, message: "Song not found" });
      }

      const isLiked = song.likes.includes(req.user.id);
      res.json({ success: true, isLiked });
  } catch (error) {
      console.error("Error fetching like status:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/like/:songId", async (req, res) => {
  try {
      const { songId } = req.params;
      let playlist = await Playlist.findOne({ title: "Liked Songs" });

      if (!playlist) {
          return res.status(404).json({ success: false, message: "Liked Songs playlist not found" });
      }

      playlist.songs = playlist.songs.filter((song) => song.toString() !== songId);
      await playlist.save();

      res.json({ success: true, message: "Song unliked successfully" });
  } catch (error) {
      console.error("❌ Error unliking song:", error);
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
        song_mp3: song.song_mp3,  
        song_title: song.song_title,
        song_artist: song.song_artist,
        song_thumbnail: song.song_thumbnail,
      })),
    });

    await newPlaylist.save();
    console.log(" Playlist Saved:", newPlaylist);

    res.json({ success: true, playlist: newPlaylist });
  } catch (error) {
    console.error(" Error creating playlist:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const playlists = await Playlist.find();
    res.json({ playlists, success: true, message: "Playlists found" });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate("songs");

    if (!playlist) {
      return res.status(404).json({ success: false, message: "Playlist not found" });
    }

    res.json({ playlist, success: true });
  } catch (error) {
    console.error(" Error fetching playlist:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
module.exports = router;


