const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  singers: [
    {
      singer_name: {
        type: String,
      },
    },
  ],
  songs: [
    {
        song_mp3:{
            type: String,
        },
        song_title:{
            type: String,
        },
        song_artist:{
            type: String,
        },
        song_thumbnail:{
            type: String,
        },
    },
  ],
});

const Playlist = mongoose.model("Playlist", PlaylistSchema);

module.exports = Playlist;
