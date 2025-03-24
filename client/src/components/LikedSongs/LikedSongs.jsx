import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedSongs = async () => {
      const token = localStorage.getItem("token"); // Ensure token is retrieved
      if (!token) {
        console.error("❌ No token found in localStorage");
        return;
      }
  
      try {
        const res = await fetch("http://localhost:8080/api/playlist/like", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token properly
          },
        });
  
        const data = await res.json();
        console.log("API Response:", data);
        
        if (data.success) {
          setLikedSongs(data.playlist.songs);
        } else {
          console.error("❌ Error fetching liked songs:", data.message);
        }
      } catch (err) {
        console.error("❌ Error fetching liked songs:", err);
      }
    };
  
    fetchLikedSongs();
  }, []);
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center text-red-500 mb-6">
        ❤️ Liked Songs
      </h2>


{likedSongs.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {likedSongs.map((song, index) => (
      <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center">
        <img
          src={`http://localhost:8080${song.artistPhotoUrl}`}
          alt={song.title}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-white">
            {song.title}
          </h3>
          <p className="text-gray-400">{song.artist}</p>
        </div>

        {/* Like Button */}
        {/* <button
  className="text-red-500 text-lg font-semibold ml-4"
  onClick={() => {
    console.log("✅ song._id before toggleLike:", song._id);
    toggleLike(song._id);
  }}
>
  ❤️ {song.isLiked ? "Unlike" : "Like"}
</button> */}
<button
  className="text-red-500 text-lg font-semibold ml-4"
  onClick={() => {
    console.log("🟢 Button Clicked!");
    toggleLike(song._id);
  }}
>
  ❤️ {song.isLiked ? "Unlike" : "Like"}
</button>

        <button
          className="text-blue-500 text-lg font-semibold ml-4"
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
