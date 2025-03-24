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
    default:"user"
  },
  DOB: {
    type: Date,
    required: true,
  },
  playlists:[
    {
      playlist_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
      }
    }
  ],
  
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     trim: true, // ✅ Remove extra spaces from username
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true, // ✅ Ensure email is unique
//     trim: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   gender: {
//     type: String,
//     required: true,
//     enum: ["M", "F", "Other"], // ✅ Restrict gender values
//   },
//   role: {
//     type: String,
//     default: "user",
//     enum: ["user", "admin"], // ✅ Role validation
//   },
//   DOB: {
//     type: Date,
//     required: true,
//   },
//   playlists: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Playlist", // ✅ Reference the Playlist model
//     },
//   ],
//   likedSongs: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Song", // ✅ Reference the Song model
//     },
//   ],
// }, { timestamps: true }); // ✅ Add timestamps for createdAt & updatedAt

// module.exports = mongoose.model("User", UserSchema);
