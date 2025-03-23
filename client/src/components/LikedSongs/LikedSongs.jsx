import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/playlist/like") // API endpoint to fetch liked songs
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLikedSongs(data.playlist.songs);
        } else {
          console.error("❌ Error fetching liked songs:", data.message);
        }
      })
      .catch((err) => console.error("❌ Error fetching liked songs:", err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center text-white mb-6">
        ❤️ Liked Songs
      </h2>

      {likedSongs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedSongs.map((song, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center"
            >
              <img
                src={song.song_thumbnail}
                alt={song.song_title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-white">
                  {song.song_title}
                </h3>
                <p className="text-gray-400">{song.song_artist}</p>
              </div>
              <button
                className="text-blue-500 text-lg font-semibold"
                onClick={() => navigate(`/playlist/${song._id}`)}
              >
                ▶ Play
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center">No liked songs yet.</p>
      )}
    </div>
  );
};

export default LikedSongs;
