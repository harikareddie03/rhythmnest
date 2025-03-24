const express = require("express");
const Playlist = require("../Models/Playlist");
const router = express.Router();
const Song = require("../Models/Song"); 
const verifyToken = require("../middlewares/authMiddleware");
const isAuthenticated = require("../middlewares/auth");
const User = require("../Models/User"); // Ensure correct path

router.get("/", async (req, res) => {
  try {
    
    const playlists = await Playlist.find();
    res.json({ playlists, success: true, message: "Playlists found" });
  } catch (error) {
    console.error("❌ Error fetching playlists:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
// // Unlike (DELETE)
// router.delete("/like/:songId", async (req, res) => {
//   try {
//     const { songId } = req.params;

//     // Find the 'Liked Songs' playlist
//     let playlist = await Playlist.findOne({ title: "Liked Songs" });

//     if (!playlist) {
//       return res.status(404).json({ success: false, message: "Liked Songs playlist not found" });
//     }

//     // Remove the song from the playlist
//     playlist.songs = playlist.songs.filter((song) => song.toString() !== songId);
//     await playlist.save();

//     res.json({ success: true, isLiked: false, playlist });
//   } catch (error) {
//     console.error("❌ Error unliking song:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

// Like (POST)
router.post("/like", async (req, res) => {
  try {
    const { song_mp3, song_title, song_artist, song_thumbnail } = req.body;

    let playlist = await Playlist.findOne({ title: "Liked Songs" });

    // If "Liked Songs" playlist doesn't exist, create it
    if (!playlist) {
      playlist = new Playlist({ title: "Liked Songs", singers: [], songs: [] });
    }

    // Check if song already exists
    let existingSong = await Song.findOne({ song_mp3 });

    if (!existingSong) {
      existingSong = new Song({ song_mp3, song_title, song_artist, song_thumbnail });
      await existingSong.save();
    }

    // Avoid duplicate entries
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

// router.get("/like",isAuthenticated, async (req, res) => {
//   try {
//     console.log("🔍 Fetching liked songs for user:", req.user); // Log user info

//     if (!req.user?.id) {
//       return res.status(401).json({ success: false, message: "User not authenticated" });
//     }

//     // Populate likedSongs field
//     const user = await User.findById(req.user.id).populate("likedSongs");

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     console.log("✅ Liked songs fetched:", user.likedSongs);
//     res.json({ success: true, playlist: { title: "Liked Songs", songs: user.likedSongs } });

//   } catch (error) {
//     console.error("❌ Error fetching liked songs:", error);
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// });
// router.post("/toggle-like/:songId", isAuthenticated, async (req, res) => {
//   try {
//       const userId = req.user.id; // Get logged-in user ID
//       const songId = req.params.songId;

//       const user = await User.findById(userId);

//       if (!user) {
//           return res.status(404).json({ success: false, message: "User not found" });
//       }

//       const songIndex = user.likedSongs.indexOf(songId);
//       let isLiked = false;

//       if (songIndex === -1) {
//           // Song is not liked, so like it
//           user.likedSongs.push(songId);
//           isLiked = true;
//       } else {
//           // Song is already liked, so unlike it
//           user.likedSongs.splice(songIndex, 1);
//       }

//       await user.save();
//       return res.json({ success: true, isLiked });
//   } catch (error) {
//       res.status(500).json({ success: false, message: "Server error", error });
//   }
// });


// router.get("/like", async (req, res) => {
//   try {
//     const userId = req.user.id; // Ensure user authentication

//     // Populate likedSongs field
//     const user = await User.findById(userId).populate("likedSongs");

//     if (!user) {
//         return res.status(404).json({ success: false, message: "User not found" });
//     }

//     res.json({ success: true, playlist: { title: "Liked Songs", songs: user.likedSongs } });
// } catch (error) {
//     res.status(500).json({ success: false, message: "Server error", error });
// }
// });


// router.post("/like/:songId", verifyToken, async (req, res) => {
//   const { songId } = req.params;
//   const userId = req.user.id;

//   try {
//       const song = await Song.findById(songId);
//       if (!song) {
//           return res.status(404).json({ success: false, message: "Song not found" });
//       }

//       let playlist = await Playlist.findOne({ title: "Liked Songs", user: userId });

//       if (!playlist) {
//           playlist = new Playlist({ title: "Liked Songs", user: userId, songs: [] });
//       }

//       // Convert ObjectId to string for proper comparison
//       const isLiked = playlist.songs.some(id => id.toString() === songId);

//       if (isLiked) {
//           playlist.songs = playlist.songs.filter(id => id.toString() !== songId);
//       } else {
//           playlist.songs.push(songId);
//       }

//       await playlist.save();
//       res.json({ success: true, isLiked: !isLiked, playlist });
//   } catch (error) {
//       console.error("❌ Error toggling like:", error);
//       res.status(500).json({ success: false, message: "Server error" });
//   }
// });
// router.post("/like/:songId", verifyToken, async (req, res) => {
//   const { songId } = req.params;
//   const userId = req.user.id; // Get the authenticated user ID

//   try {
//     const song = await Song.findById(songId);
//     if (!song) {
//       return res.status(404).json({ success: false, message: "Song not found" });
//     }

//     let playlist = await Playlist.findOne({ title: "Liked Songs", user: userId });

//     if (!playlist) {
//       playlist = new Playlist({ title: "Liked Songs", user: userId, songs: [] });
//     }

//     // Ensure ObjectId comparison works correctly
//     const songExists = playlist.songs.some(id => id.toString() === songId);

//     if (songExists) {
//       playlist.songs = playlist.songs.filter(id => id.toString() !== songId);
//     } else {
//       playlist.songs.push(songId);
//     }

//     await playlist.save();

//     // Return updated playlist in the response
//     res.json({ success: true, isLiked: !songExists, playlist });

//   } catch (error) {
//     console.error("❌ Error toggling like:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// router.get("/like/:songId", isAuthenticated, async (req, res) => {
//   const { songId } = req.params;
//   // console.log("Fetching like status for song:", songId);

//   try {
//       const song = await Song.findById(songId);
//       if (!song) {
//           return res.status(404).json({ success: false, message: "Song not found" });
//       }

//       const isLiked = song.likes.includes(req.user.id); // Check if user liked the song
//       res.json({ success: true, isLiked });
//   } catch (error) {
//       console.error("Error fetching like status:", error);
//       res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// router.delete("/like/:songId", async (req, res) => {
//   try {
//       const { songId } = req.params;

//       // Find the 'Liked Songs' playlist
//       let playlist = await Playlist.findOne({ title: "Liked Songs" });

//       if (!playlist) {
//           return res.status(404).json({ success: false, message: "Liked Songs playlist not found" });
//       }

//       // Remove the song from the playlist
//       playlist.songs = playlist.songs.filter((song) => song.toString() !== songId);
//       await playlist.save();

//       res.json({ success: true, message: "Song unliked successfully" });
//   } catch (error) {
//       console.error("❌ Error unliking song:", error);
//       res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

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


