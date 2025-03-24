import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillHeart, AiOutlineHeart, AiOutlinePlaySquare } from "react-icons/ai";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
import { BiRepeat, BiShuffle } from "react-icons/bi";
import { FaPause, FaPlay } from "react-icons/fa";
import { PiMicrophoneStageDuotone, PiQueueLight } from "react-icons/pi";
import { HiSpeakerXMark, HiSpeakerWave } from "react-icons/hi2";
import { BsArrowsAngleContract, BsSpeakerFill } from "react-icons/bs";
import { pauseMaster, playMaster, playSong } from "../../states/Actors/SongActor";
import { useGlobalContext } from "../../states/Contet";
import "./SongBar.css";

const SongBar = ({loggedInUserId}) => {
    const [songs, setSongs] = useState([]);
    const [volume, setVolume] = useState(50);
    const [isLiked, setIsLiked] = useState(false);
    const [likedSongs, setLikedSongs] = useState([]);
    // const [loggedInUserId, setLoggedInUserId] = useState(null);

    const dispatch = useDispatch();
    const { masterSong, isPlaying } = useSelector((state) => state.mainSong);
    const isLoggedIn = sessionStorage.getItem("token") !== null;

    const {
        progress,
        setProgress,
        resetEverything,
        songIdx,
        setSongIdx,
        currTime,
        setCurrTime,
        duration,
        setDuration,
    } = useGlobalContext();

    // Fetch songs from API
    useEffect(() => {
        fetch("http://localhost:8080/api/songs")
            .then((res) => res.json())
            .then((data) => {
                if (data.success && Array.isArray(data.songs)) {
                    setSongs(data.songs);
                } else {
                    console.error("Unexpected API response:", data);
                }
            })
            .catch((error) => console.error("Error fetching songs:", error));
    }, []);

    // Handle playing & progress tracking
    useEffect(() => {
        if (!masterSong?.mp3) return;
        setDuration(formatTime(masterSong.mp3.duration));

        if (isPlaying) {
            masterSong.mp3.play();
        } else {
            masterSong.mp3.pause();
        }

        const interval = setInterval(() => {
            if (!masterSong?.mp3) return;
            setProgress(
                Math.round((masterSong.mp3.currentTime / masterSong.mp3.duration) * 100)
            );
            setCurrTime(formatTime(masterSong.mp3.currentTime));
        }, 1000);

        return () => clearInterval(interval);
    }, [masterSong, isPlaying, setProgress, setCurrTime, setDuration]);

    // Fetch like status of the current song
    useEffect(() => {
        if (!masterSong?._id) return;
    
        console.log("Fetching like status for song:", masterSong?._id);
        console.log("Token from sessionStorage:", sessionStorage.getItem("token"));
        fetch(`http://localhost:8080/api/playlist/like/${masterSong._id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        })
        
        // fetch(`http://localhost:8080/api/playlist/like/${masterSong._id}`, {
        //     headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        // })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            // console.log("Like status response:", data);
            if (data.success) {
                setIsLiked(data.isLiked);
            } else {
                setIsLiked(false);
            }
        })
        .catch((error) => console.error("Error fetching like status:", error));
    }, [masterSong]); // Runs when masterSong changes
   
    const fetchLikedSongs = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/playlist/like", {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            const data = await response.json();
            console.log("Liked Songs Updated:", data.playlist.songs); // Check if the updated list is received
    
            if (data.success) {
                setLikedSongs(data.playlist.songs); // Ensure state is updated
            }
        } catch (error) {
            console.error("Error fetching liked songs:", error);
        }
    };
    
   
    const toggleLike = async (songId) => {
        console.log("🟢 Received songId:", songId); // ✅ Debugging log
      
        if (!songId || typeof songId !== "string") {
          console.error("❌ Invalid Song ID:", songId);
          return;
        }
      
        const user = JSON.parse(sessionStorage.getItem("user"));
        const userId = user?._id;
      
        if (!userId) {
          console.error("❌ User ID is missing");
          return;
        }
      
        console.log("📨 Sending request with:", { userId, songId });
      
        try {
          const response = await fetch("/api/user/like", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, songId }),
          });
      
          const data = await response.json();
          if (data.success) {
            console.log("✅ Like toggled successfully:", data);
          } else {
            console.error("❌ API Error:", data.message);
          }
        } catch (error) {
          console.error("❌ Error toggling like:", error);
        }
      };
      
  
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.round(time % 60);
        return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    // Handle song change (next/prev)
    const changeSong = (direction) => {
        if (!songs.length) return;

        let newIndex = (songIdx + direction + songs.length) % songs.length;

        resetEverything();
        masterSong?.mp3.pause();
        setSongIdx(newIndex);
        dispatch(playSong(songs[newIndex]));
    };

    // Handle play/pause
    const handleMaster = () => {
        dispatch(isPlaying ? pauseMaster() : playMaster());
    };

    // Handle progress change
    const changeProgress = (e) => {
        const newProgress = e.target.value;
        setProgress(newProgress);
        masterSong.mp3.currentTime = (newProgress / 100) * masterSong.mp3.duration;
    };

    // Handle volume change
    const changeVolume = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        masterSong.mp3.volume = newVolume / 100;
    };

    if (!isLoggedIn) return null;

    return (
        <div className="fixed w-full flex px-2 items-center justify-between bottom-0 left-0 h-20 bg-red-500">
            {/* Left Section - Song Info */}
            <div className="w-2/12 flex items-center gap-2">
                <img 
                    src={masterSong?.artistPhotoUrl 
                        ? `http://localhost:8080${masterSong.artistPhotoUrl}` 
                        : "http://localhost:8080/uploads/default.jpg"} 
                    alt="Artist"
                    className="h-12"
                    onError={(e) => { e.target.src = "http://localhost:8080/uploads/default.jpg"; }}
                />
                <div>
                    <h3 className="text-xs font-medium">{masterSong?.title || "Unknown"}</h3>
                    <span className="text-[10px]">{masterSong?.artist || "Unknown"}</span>
                </div>
                
                
                <button onClick={toggleLike} className="cursor-pointer text-2xl hover:text-white">
    {isLiked ? <AiFillHeart className="text-white" /> : <AiOutlineHeart />}
</button>

            </div>

            {/* Middle Section - Controls */}
            <div className="w-5/12">
                <div className="flex justify-center items-center gap-6">
                    <BiShuffle />
                    <IoMdSkipBackward onClick={() => changeSong(-1)} />
                    <button onClick={handleMaster} className="flex items-center rounded-full bg-white p-2">
                        {isPlaying ? <FaPause className="text-black" /> : <FaPlay className="text-black" />}
                    </button>
                    <IoMdSkipForward onClick={() => changeSong(1)} />
                    <BiRepeat />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs">{currTime}</span>
                    <input type="range" min={0} max={100} value={progress} onChange={changeProgress} className="w-full" />
                    <span className="text-xs">{duration}</span>
                </div>
            </div>

            {/* Right Section - Volume & Settings */}
            <div className="w-2/12 flex items-center gap-2">
                <AiOutlinePlaySquare className="text-2xl" />
                <PiMicrophoneStageDuotone className="text-2xl" />
                <PiQueueLight className="text-2xl" />
                <BsSpeakerFill className="text-2xl" />
                {volume > 0 ? <HiSpeakerWave className="text-2xl" /> : <HiSpeakerXMark className="text-2xl" />}
                <input type="range" min={0} max={100} value={volume} onChange={changeVolume} className="w-full" />
                <BsArrowsAngleContract />
            </div>
        </div>
    );
};

export default SongBar;





// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AiFillHeart, AiOutlineHeart, AiOutlinePlaySquare } from "react-icons/ai";
// import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
// import { CgScreen } from "react-icons/cg";
// import { BiRepeat, BiShuffle } from "react-icons/bi";
// import { FaPause, FaPlay } from "react-icons/fa";
// import { PiMicrophoneStageDuotone, PiQueueLight } from "react-icons/pi";
// import { HiSpeakerXMark, HiSpeakerWave } from "react-icons/hi2";
// import { BsArrowsAngleContract, BsSpeakerFill } from "react-icons/bs";
// import {
//     pauseMaster,
//     playMaster,
//     playSong,
// } from "../../states/Actors/SongActor";
// import { useGlobalContext } from "../../states/Contet";
// import "./SongBar.css";

// const SongBar = () => {
//     const [songs, setSongs] = useState([]);
//     const [volume, setVolume] = useState(50);
//     const dispatch = useDispatch();
//     const { masterSong, isPlaying } = useSelector((state) => state.mainSong);
//     const isLoggedIn = sessionStorage.getItem("token") !== null;
    
//     const {
//         progress,
//         setProgress,
//         resetEverything,
//         songIdx,
//         setSongIdx,
//         currTime,
//         setCurrTime,
//         duration,
//         setDuration,
//     } = useGlobalContext();

//     useEffect(() => {
//         fetch("http://localhost:8080/api/songs")
//             .then((res) => res.json())
//             .then((data) => {
//                 if (data.success && Array.isArray(data.songs)) {
//                     setSongs(data.songs);
//                 } else {
//                     console.error("Unexpected API response:", data);
//                 }
//             })
//             .catch((error) => console.error("Error fetching songs:", error));
//     }, []);

//     useEffect(() => {
//         if (!masterSong?.mp3) return;
//         setDuration(formatTime(masterSong.mp3.duration));

//         if (isPlaying) {
//             masterSong.mp3.play();
//         } else {
//             masterSong.mp3.pause();
//         }

//         const interval = setInterval(() => {
//             if (!masterSong?.mp3) return;
//             setProgress(
//                 Math.round((masterSong.mp3.currentTime / masterSong.mp3.duration) * 100)
//             );
//             setCurrTime(formatTime(masterSong.mp3.currentTime));
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [masterSong, isPlaying, setProgress, setCurrTime, setDuration]);

//     const handleMaster = () => {
//         dispatch(isPlaying ? pauseMaster() : playMaster());
//     };

//     const changeProgress = (e) => {
//         const newProgress = e.target.value;
//         setProgress(newProgress);
//         masterSong.mp3.currentTime = (newProgress / 100) * masterSong.mp3.duration;
//     };

//     const changeVolume = (e) => {
//         const newVolume = e.target.value;
//         setVolume(newVolume);
//         masterSong.mp3.volume = newVolume / 100;
//     };

//     const formatTime = (time) => {
//         const minutes = Math.floor(time / 60);
//         const seconds = Math.round(time % 60);
//         return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//     };

//     const changeSong = (direction) => {
//         if (!songs.length) return;
    
//         let newIndex = (songIdx + direction + songs.length) % songs.length; // Loop logic
    
//         resetEverything();
//         masterSong?.mp3.pause();
//         setSongIdx(newIndex);
//         dispatch(playSong(songs[newIndex]));
//     };
    

//     if (!isLoggedIn) return null;
//     //console.log("MasterSong Image Path:", masterSong?.img);


//     return (
//         <div className="fixed w-full flex px-2 items-center justify-between bottom-0 left-0 h-20 bg-red-500">
//             <div className="w-2/12 flex items-center gap-2">
//             <img 
//   src={masterSong?.artistPhotoUrl 
//     ? `http://localhost:8080${masterSong.artistPhotoUrl}` 
//     : "http://localhost:8080/uploads/default.jpg"} 
//   alt="Artist"
//   className="h-12"
//   onError={(e) => { 
//     e.target.onerror = null; 
//     e.target.src = "http://localhost:8080/uploads/default.jpg"; 
//   }}
// />

//                 <div>
//                     <h3 className="text-xs font-medium">{masterSong?.title || "Unknown"}</h3>
//                     <span className="text-[10px]">{masterSong?.artist || "Unknown"}</span>
//                 </div>
                
//                 <AiOutlineHeart className="cursor-pointert text-2xl hover:text-white" />

       
          
//             </div>

//             <div className="w-5/12">
//                 <div className="flex justify-center items-center gap-6">
//                     <BiShuffle />
//                     <IoMdSkipBackward onClick={() => changeSong(-1)} />
//                     <button onClick={handleMaster} className="flex items-center rounded-full bg-white p-2">
//                         {isPlaying ? <FaPause className="text-black" /> : <FaPlay className="text-black" />}
//                     </button>
//                     <IoMdSkipForward onClick={() => changeSong(1)} />
//                     <BiRepeat />
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <span className="text-xs">{currTime}</span>
//                     <input type="range" min={0} max={100} value={progress} onChange={changeProgress} className="w-full" />
//                     <span className="text-xs">{duration}</span>
//                 </div>
//             </div>

//             <div className="w-2/12 flex items-center gap-2">
//                 <AiOutlinePlaySquare className="text-2xl" />
//                 <PiMicrophoneStageDuotone className="text-2xl" />
//                 <PiQueueLight className="text-2xl" />
//                 <BsSpeakerFill className="text-2xl" />
//                 {volume > 0 ? <HiSpeakerWave className="text-2xl" /> : <HiSpeakerXMark className="text-2xl" />}
//                 <input type="range" min={0} max={100} value={volume} onChange={changeVolume} className="w-full" />
//                 <BsArrowsAngleContract />
//             </div>
//         </div>
//     );
// };

// export default SongBar;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AiFillHeart, AiOutlineHeart, AiOutlinePlaySquare } from "react-icons/ai";
// import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
// import { BiRepeat, BiShuffle } from "react-icons/bi";
// import { FaPause, FaPlay } from "react-icons/fa";
// import { PiMicrophoneStageDuotone, PiQueueLight } from "react-icons/pi";
// import { HiSpeakerXMark, HiSpeakerWave } from "react-icons/hi2";
// import { BsArrowsAngleContract, BsSpeakerFill } from "react-icons/bs";
// import { pauseMaster, playMaster, playSong } from "../../states/Actors/SongActor";
// import { useGlobalContext } from "../../states/Contet";
// import "./SongBar.css";

// const SongBar = () => {
//     const [songs, setSongs] = useState([]);
//     const [volume, setVolume] = useState(50);
//     const [isLiked, setIsLiked] = useState(false);
    
//     const dispatch = useDispatch();
//     const { masterSong, isPlaying } = useSelector((state) => state.mainSong);
//     const isLoggedIn = sessionStorage.getItem("token") !== null;

//     const {
//         progress,
//         setProgress,
//         resetEverything,
//         songIdx,
//         setSongIdx,
//         currTime,
//         setCurrTime,
//         duration,
//         setDuration,
//     } = useGlobalContext();

//     // Fetch songs from API
//     useEffect(() => {
//         fetch("http://localhost:8080/api/songs")
//             .then((res) => res.json())
//             .then((data) => {
//                 if (data.success && Array.isArray(data.songs)) {
//                     setSongs(data.songs);
//                 } else {
//                     console.error("Unexpected API response:", data);
//                 }
//             })
//             .catch((error) => console.error("Error fetching songs:", error));
//     }, []);

//     // Handle playing & progress tracking
//     useEffect(() => {
//         if (!masterSong?.mp3) return;
//         setDuration(formatTime(masterSong.mp3.duration));

//         if (isPlaying) {
//             masterSong.mp3.play();
//         } else {
//             masterSong.mp3.pause();
//         }

//         const interval = setInterval(() => {
//             if (!masterSong?.mp3) return;
//             setProgress(
//                 Math.round((masterSong.mp3.currentTime / masterSong.mp3.duration) * 100)
//             );
//             setCurrTime(formatTime(masterSong.mp3.currentTime));
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [masterSong, isPlaying, setProgress, setCurrTime, setDuration]);

//     // Fetch like status of the current song
//     useEffect(() => {
//         if (!masterSong?._id) return;

//         fetch(`http://localhost:8080/api/playlist/like/${masterSong._id}`, {
//             headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
//         })
//             .then((res) => res.json())
//             .then((data) => {
//                 console.log("Like status response:", data);
//                 if (data.success) {
//                     setIsLiked(data.isLiked);
//                 }
//             })
//             .catch((error) => console.error("Error fetching like status:", error));
//     }, [masterSong]);

//     // Toggle Like/Unlike
//     const toggleLike = async () => {
//         if (!masterSong?._id) return;

//         try {
//             const response = await fetch(`http://localhost:8080/api/playlist/like/${masterSong._id}`, {
//                 method: isLiked ? "DELETE" : "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//                 },
//             });

//             const data = await response.json();
//             console.log("Toggle like response:", data);

//             if (data.success) {
//                 setIsLiked(data.isLiked);
//             } else {
//                 console.error("Error liking song:", data.message);
//             }
//         } catch (error) {
//             console.error("Error toggling like:", error);
//         }
//     };

//     // Format time for display
//     const formatTime = (time) => {
//         const minutes = Math.floor(time / 60);
//         const seconds = Math.round(time % 60);
//         return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//     };

//     // Handle song change (next/prev)
//     const changeSong = (direction) => {
//         if (!songs.length) return;

//         let newIndex = (songIdx + direction + songs.length) % songs.length;

//         resetEverything();
//         masterSong?.mp3.pause();
//         setSongIdx(newIndex);
//         dispatch(playSong(songs[newIndex]));
//     };

//     // Handle play/pause
//     const handleMaster = () => {
//         dispatch(isPlaying ? pauseMaster() : playMaster());
//     };

//     // Handle progress change
//     const changeProgress = (e) => {
//         const newProgress = e.target.value;
//         setProgress(newProgress);
//         masterSong.mp3.currentTime = (newProgress / 100) * masterSong.mp3.duration;
//     };

//     // Handle volume change
//     const changeVolume = (e) => {
//         const newVolume = e.target.value;
//         setVolume(newVolume);
//         masterSong.mp3.volume = newVolume / 100;
//     };

//     if (!isLoggedIn) return null;

//     return (
//         <div className="fixed w-full flex px-2 items-center justify-between bottom-0 left-0 h-20 bg-red-500">
//             {/* Left Section - Song Info */}
//             <div className="w-2/12 flex items-center gap-2">
//                 <img 
//                     src={masterSong?.artistPhotoUrl 
//                         ? `http://localhost:8080${masterSong.artistPhotoUrl}` 
//                         : "http://localhost:8080/uploads/default.jpg"} 
//                     alt="Artist"
//                     className="h-12"
//                     onError={(e) => { e.target.src = "http://localhost:8080/uploads/default.jpg"; }}
//                 />
//                 <div>
//                     <h3 className="text-xs font-medium">{masterSong?.title || "Unknown"}</h3>
//                     <span className="text-[10px]">{masterSong?.artist || "Unknown"}</span>
//                 </div>
                
//                 <button onClick={toggleLike} className="cursor-pointer text-2xl hover:text-white">
//                     {isLiked ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
//                 </button>
//             </div>

//             {/* Middle Section - Controls */}
//             <div className="w-5/12">
//                 <div className="flex justify-center items-center gap-6">
//                     <BiShuffle />
//                     <IoMdSkipBackward onClick={() => changeSong(-1)} />
//                     <button onClick={handleMaster} className="flex items-center rounded-full bg-white p-2">
//                         {isPlaying ? <FaPause className="text-black" /> : <FaPlay className="text-black" />}
//                     </button>
//                     <IoMdSkipForward onClick={() => changeSong(1)} />
//                     <BiRepeat />
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <span className="text-xs">{currTime}</span>
//                     <input type="range" min={0} max={100} value={progress} onChange={changeProgress} className="w-full" />
//                     <span className="text-xs">{duration}</span>
//                 </div>
//             </div>

//             {/* Right Section - Volume & Settings */}
//             <div className="w-2/12 flex items-center gap-2">
//                 <AiOutlinePlaySquare className="text-2xl" />
//                 <PiMicrophoneStageDuotone className="text-2xl" />
//                 <PiQueueLight className="text-2xl" />
//                 <BsSpeakerFill className="text-2xl" />
//                 {volume > 0 ? <HiSpeakerWave className="text-2xl" /> : <HiSpeakerXMark className="text-2xl" />}
//                 <input type="range" min={0} max={100} value={volume} onChange={changeVolume} className="w-full" />
//                 <BsArrowsAngleContract />
//             </div>
//         </div>
//     );
// };

// export default SongBar;
