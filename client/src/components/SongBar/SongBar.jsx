import React from "react";
import { useAuth } from "../../context/AuthContext"; 
import { useNavigate } from "react-router-dom";

const SongBar = ({ song }) => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const audioRef = React.useRef(null); 

    const handlePlaySong = () => {
        console.log("Play button clicked.");
        console.log("Login status:", isLoggedIn);

        if (!isLoggedIn) {
            console.log("User not logged in. Redirecting to login prompt...");
            navigate("/login-prompt");
        } else {
            console.log("User logged in. Playing song...");
            if (audioRef.current) {
                audioRef.current.play();
            } else {
                console.error("Audio element not found!");
            }
        }
    };

    return (
        <div className="song-bar">
            <h3>{song?.title}</h3>
            <button onClick={handlePlaySong} className="play-button">
                Play
            </button>
            <audio ref={audioRef} src={song?.url} controls={false} />
        </div>
    );
};

export default SongBar;
