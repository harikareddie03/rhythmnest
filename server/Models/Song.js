const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    songUrl: { type: String, required: true }, // URL to the uploaded song
    artistPhotoUrl: { type: String, required: true }, // URL to the artist's photo
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Song", SongSchema);
