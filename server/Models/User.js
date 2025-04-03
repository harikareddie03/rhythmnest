const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  DOB: {
    type: Date,
    required: true,
  },
  playlists: [
    {
      playlist_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },
  ],
  likedSongs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
