import React from "react";
import { useAuth } from "../../context/AuthContext"; // Ensure this path is correct
import { useNavigate } from "react-router-dom";

const SongBar = ({ song }) => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const audioRef = React.useRef(null); // Reference for audio element

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
            {/* Add audio element */}
            <audio ref={audioRef} src={song?.url} controls={false} />
        </div>
    );
};

export default SongBar;

// import React, { useState, useEffect, useRef } from "react";
// import { useAuth } from "../../context/AuthContext"; // Ensure this path is correct
// import { useNavigate } from "react-router-dom";

// const SongBar = ({ song }) => {
//     const { isLoggedIn, token } = useAuth();
//     const navigate = useNavigate();
//     const audioRef = useRef(null); // Reference for audio element
//     const [isLiked, setIsLiked] = useState(false); // State for like status

//     // Check if song is already liked when component loads
//     useEffect(() => {
//         if (isLoggedIn && song?._id) {
//             fetch(`/api/like/${song._id}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             })
//                 .then(res => res.json())
//                 .then(data => {
//                     if (data.success) {
//                         setIsLiked(data.isLiked);
//                     }
//                 })
//                 .catch(err => console.error("Error fetching like status:", err));
//         }
//     }, [isLoggedIn, song?._id, token]);

//     // Function to toggle like status
//     const handleLikeToggle = async () => {
//         if (!isLoggedIn) {
//             navigate("/login-prompt");
//             return;
//         }

//         try {
//             const response = await fetch(`/api/like/${song._id}`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             const data = await response.json();
//             console.log("Toggle like response:", data);

//             if (data.success) {
//                 setIsLiked(data.isLiked);
//             }
//         } catch (error) {
//             console.error("Error toggling like:", error);
//         }
//     };

//     const handlePlaySong = () => {
//         console.log("Play button clicked.");
//         console.log("Login status:", isLoggedIn);

//         if (!isLoggedIn) {
//             console.log("User not logged in. Redirecting to login prompt...");
//             navigate("/login-prompt");
//         } else {
//             console.log("User logged in. Playing song...");
//             if (audioRef.current) {
//                 audioRef.current.play();
//             } else {
//                 console.error("Audio element not found!");
//             }
//         }
//     };

//     return (
//         <div className="song-bar">
//             <h3>{song?.title}</h3>
//             <button onClick={handlePlaySong} className="play-button">
//                 Play
//             </button>
//             <button onClick={handleLikeToggle} className="like-button">
//                 {isLiked ? "Unlike" : "Like"}
//             </button>
//             {/* Add audio element */}
//             <audio ref={audioRef} src={song?.url} controls={false} />
//         </div>
//     );
// };

// export default SongBar;
