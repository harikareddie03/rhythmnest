const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    songUrl: { type: String, required: true }, 
    artistPhotoUrl: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Song", SongSchema);
