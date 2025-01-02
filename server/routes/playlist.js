const express = require("express");
const Playlist = require("../Models/Playlist");
const router = express.Router();

router.get("/", async (req, res) => {
  const playlists = await Playlist.find();
  res.json({ playlists, success: true, message: "playlists found" });

});
router.post("/like", async (req, res) => {
  const { song_mp3, song_title, song_artist, song_thumbnail } = req.body;
  
  const playlist = await Playlist.findOne({ title: "Liked Songs" });
  playlist.songs.push({ song_mp3, song_title, song_artist, song_thumbnail })
  playlist.save()
  res.json({ playlist, success: true, message: "song liked" });
});

router.post("/create", async (req, res) => {
  const { singers, songs, title } = req.body;
  const playlist = await Playlist.create({ singers, songs, title });

  res.json({ playlist, success: true, message: "playlist" });
});
module.exports = router;
