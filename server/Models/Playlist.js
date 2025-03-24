// const mongoose = require("mongoose");

// const PlaylistSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true, // Title must be provided
//       trim: true, // Remove unnecessary spaces
//     },
//     singers: [
//       {
//         singer_name: {
//           type: String,
//           required: true, // Ensure every singer has a name
//         },
//       },
//     ],
//     songs: [
//       {
//         song_mp3: {
//           type: String,
//           required: true, // Ensure every song has an MP3 URL
//         },
//         song_title: {
//           type: String,
//           required: true, // Ensure every song has a title
//         },
//         song_artist: {
//           type: String,
//           required: true, // Ensure every song has an artist
//         },
//         song_thumbnail: {
//           type: String,
//           default: "", // Provide a default value to avoid null issues
//         },
//       },
//     ],
//   },
//   { timestamps: true } // Adds createdAt & updatedAt fields
// );

// const Playlist = mongoose.model("Playlist", PlaylistSchema);

// module.exports = Playlist;


// const mongoose = require("mongoose");

// const PlaylistSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     singers: [
//       {
//         singer_name: {
//           type: String,
//           required: true,
//         },
//       },
//     ],
//     songs: [
//       {
//         type: mongoose.Schema.Types.ObjectId, // Store only song IDs
//         ref: "Song", // Reference the Song model
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const Playlist = mongoose.model("Playlist", PlaylistSchema);

// module.exports = Playlist;
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