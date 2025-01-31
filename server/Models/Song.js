const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String },
    genre: { type: String },
    songUrl: { type: String, required: true }, // URL to the uploaded song
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Song", SongSchema);
