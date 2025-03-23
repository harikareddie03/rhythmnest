import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

const PlaylistDetails = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [playingSong, setPlayingSong] = useState(null); // Track the currently playing song
  const audioRef = useRef(null); // Reference for controlling the audio player

  useEffect(() => {
    if (!id || id.includes("{")) { // Check if id is invalid
      console.error("❌ Invalid playlist ID:", id);
      return;
    }
    console.log("id",id)
    fetch(`http://localhost:8080/api/playlist/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("data",data);
        if (data.success) {
          setPlaylist(data.playlist);
        } else {
          console.error("❌ Error fetching playlist:", data.message);
        }
      })
      .catch((err) => console.error("❌ Error fetching playlist:", err));
  }, [id]);

  const handlePlayPause = (song) => {
    if (!song.song_mp3) {
      console.error("❌ Invalid song object:", song);
      return;
    }
  
    const fullUrl = `http://localhost:8080${song.song_mp3}`;
console.log("songs",song);
    console.log("🔗 Playing:", fullUrl);
  
    fetch(fullUrl, { method: "HEAD" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`File not found: ${fullUrl}`);
      }
      if (playingSong === fullUrl) {
        setPlayingSong(null);
        if (audioRef.current) audioRef.current.pause();
      } else {
        setPlayingSong(fullUrl);
        if (audioRef.current) {
          audioRef.current.src = fullUrl;
          audioRef.current.play();
        }
      }
    })
    .catch((error) => console.error("❌ Error loading audio file:", error));
};
  

return (
  <div className="p-6">
    {playlist ? (
      <>
        <h2 className="text-4xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
          🎵 {playlist.title}
        </h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto mb-6 rounded-full"></div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-gray-100 p-3 font-bold text-gray-700">
            <span>🎶 Song Name</span>
            <span>🎤 Singer</span>
            <span className="text-center">▶ Play</span>
          </div>

          {/* Songs List */}
          {playlist.songs.length > 0 ? (
            playlist.songs.map((song, index) => (
              <div
                key={index}
                className="grid grid-cols-3 items-center p-3 border-b hover:bg-gray-50"
              >
                <span className="truncate">{song.song_title}</span>
                <span className="truncate text-gray-600">{song.song_artist}</span>
                <button
                  className="truncate text-blue-500 text-lg font-semibold hover:bg-slate-100"
                  onClick={() => handlePlayPause(song)}
                >
                  {playingSong === `http://localhost:8080${song.song_mp3}`
                    ? "⏸ Pause"
                    : "▶ Play"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center p-4">No songs in this playlist.</p>
          )}
        </div>

        {/* Single Global Audio Player */}
        <audio ref={audioRef} controls autoPlay hidden />
      </>
    ) : (
      <p className="text-center text-gray-500">Loading...</p>
    )}
  </div>
);
};

export default PlaylistDetails;
