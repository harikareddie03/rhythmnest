
import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


const CreatePlaylist = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allSongs, setAllSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playingSong, setPlayingSong] = useState(null);
  const audioRef = useRef(null); 
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchSongs = async () => {
    if (!user) {
      navigate("/login-prompt");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/songs?search=${searchTerm}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      console.log("Fetched Songs fetch:", data.songs);
      setAllSongs(data.songs || []);
    } catch (error) {
      console.error("Failed to fetch songs:", error);
      setAllSongs([]);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [searchTerm]);

  const handleSelectSong = (song) => {
    setSelectedSongs((prevSelected) => {
      const isAlreadySelected = prevSelected.some((s) => s._id === song._id);
  
      console.log(" Clicked Song:", song);
      console.log(" Previously Selected:", prevSelected);
  
      if (isAlreadySelected) {
        console.log("Removing Song:", song.title);
        return prevSelected.filter((s) => s._id !== song._id);
      } else {
        console.log("Adding Song:", song.title);
        return [...prevSelected, song];
      }
    });
  };
  
  const handlePlayPause = (song) => {
    if (!song.songUrl) {
      console.error("Invalid song object:", song);
      return;
    }

    const fullUrl = `http://localhost:8080${song.songUrl}`;
    
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
  };
  const handleSavePlaylist = async () => {
        if (!playlistName.trim()) {
          alert("Please enter a playlist name!");
          return;
        }
       console.log("songs",selectedSongs)
        const payload = {
          title: playlistName,
          singers: [],
          songs: selectedSongs.map(song => ({
            song_mp3: song.songUrl || "default.mp3",
            song_title: song.title || "Unknown Title",
            song_artist: song.artist || "Unknown Artist",
            song_thumbnail: song.thumbnail || "default.jpg",
          })), 
        };
        console.log("palload",payload);
        try {
          const res = await fetch("http://localhost:8080/api/playlist/create-playlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
    
          if (!res.ok) throw new Error("Failed to save playlist");
    
          console.log(" Playlist saved successfully!");
          toast.success("Playlist saved successfully!");
          setPlaylistName("");
          setSelectedSongs([]);
        } catch (error) {
          console.error(" Error saving playlist:", error.message);
        }
      };
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Create Playlist</h2>

      <input
        type="text"
        placeholder="Enter Playlist Name..."
        className="border p-2 w-full mb-3"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Search songs..."
        className="border p-2 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="mt-4">
        {allSongs.length > 0 ? (
          allSongs.map((song) => (
            <div
              key={song._id}
              className={`p-2 border-b flex justify-between bg-gray items-center ${
                selectedSongs.some((s) => s._id === song._id) ? "bg-gray-500" : ""
              }`}
              onClick={() => handleSelectSong(song)}
            >
              
                <span>{song.title} - {song.artist}</span>
                <br />
                <button
                  className="text-blue-500 text-xl mt-1 pr-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPause(song);
                  }}
                >
                  {playingSong === `http://localhost:8080${song.songUrl}` ? "⏸ Pause" : "▶ Play"}
                </button>
              </div>
            
          ))
        ) : (
          <p className="text-gray-500">No songs found.</p>
        )}
      </div>
      
      <audio ref={audioRef} controls autoPlay hidden />
      
      <button
        onClick={handleSavePlaylist}
        className="mt-4 bg-blue-500 text-white p-2 rounded w-full"
      >
        Save Playlist
      </button>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default CreatePlaylist;


