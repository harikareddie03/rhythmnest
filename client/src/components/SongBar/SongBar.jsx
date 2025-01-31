
import React from "react";
import { useAuth } from "../../context/AuthContext";// Ensure this path is correct
import { useNavigate } from "react-router-dom";

const SongBar = ({ song }) => {
    const { isLoggedIn } = useAuth(); // Access login status
    const navigate = useNavigate();

    const handlePlaySong = () => {
        console.log("Play button clicked."); // Log to confirm the function is called
        console.log("Login status:", isLoggedIn);

        if (!isLoggedIn) {
            console.log("User not logged in. Redirecting to login prompt...");
            navigate("/login-prompt"); // Redirect if not logged in
        } else {
            console.log("User logged in. Playing song...");
            // Logic for playing the song goes here
        }
    };

    return (
        <div className="song-bar">
            <h3>{song.title}</h3>
            <button onClick={handlePlaySong} className="play-button">
                Play
            </button>
        </div>
    );
};

export default SongBar;
