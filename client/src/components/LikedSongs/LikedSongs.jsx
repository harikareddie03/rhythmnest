import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { saveLastVisitedPage } from "../../../utils/sessionUtils";


const LikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null); 
  const [audio, setAudio] = useState(null); 
  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    fetchLikedSongs();
  }, []);


  const fetchLikedSongs = async () => {
    console.log("🔍 fetchLikedSongs function called...");

    
    try {
        const token = sessionStorage.getItem("token");
        const user = JSON.parse(sessionStorage.getItem("user")); 

        if (!token || !user?._id) {
            console.error(" No token or user ID found in sessionStorage");
            return;
        }

        console.log("Token:", token);
        console.log("User ID:", user._id);

        const response = await fetch(`http://localhost:8080/api/user/like/${user._id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData.message || "Unauthorized access");
            return;
        }

        const data = await response.json();
        console.log(" Liked Songs Fetched:", data.likedSongs);

        if (data.success) {
            setLikedSongs(data.likedSongs || []);
        }
    } catch (error) {
        console.error(" Error fetching liked songs:", error);
    }
};
useEffect(() => {
  if (!user) {
      fetchLikedSongs();
  }
}, [user]);

  const toggleLike = async (songId) => {
    const token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!token || !user?._id) {
        console.error(" User not logged in or missing ID");
        return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/user/like/${user._id}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            userId: user._id,  
            songId: songId 
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Song Liked/Unliked:", songId);
        fetchLikedSongs(); 
      } else {
        console.error("API Error:", data.message);
      }

    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handlePlayPause = (song) => {
    if (currentSong?._id === song._id) {
      if (audio) {
        audio.pause();
        setCurrentSong(null);
      }
    } else {
      if (audio) {
        audio.pause();
      }

      const newAudio = new Audio(`http://localhost:8080${song.songUrl}`);
      newAudio.play();

      setCurrentSong(song);
      setAudio(newAudio);
    }
  };

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
                <h3 className="text-lg font-semibold text-white">{song.title}</h3>
                <p className="text-gray-400">{song.artist}</p>
              </div>
              <button
                className="text-red-500 text-lg font-semibold ml-4"
                onClick={() => toggleLike(song._id)}
              >
                 {song.isLiked ? "Unlike" : "Like"}
              </button>

              <button
                className="text-blue-500 text-lg font-semibold ml-4"
                onClick={() => handlePlayPause(song)}
              >
                {currentSong?._id === song._id ? "⏸ Pause" : "▶ Play"}
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
