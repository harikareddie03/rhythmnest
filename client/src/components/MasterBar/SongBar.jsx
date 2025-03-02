import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineHeart, AiOutlinePlaySquare } from "react-icons/ai";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
import { CgScreen } from "react-icons/cg";
import { BiRepeat, BiShuffle } from "react-icons/bi";
import { FaPause, FaPlay } from "react-icons/fa";
import { PiMicrophoneStageDuotone, PiQueueLight } from "react-icons/pi";
import { HiSpeakerXMark, HiSpeakerWave } from "react-icons/hi2";
import { BsArrowsAngleContract, BsSpeakerFill } from "react-icons/bs";
import {
    pauseMaster,
    playMaster,
    playSong,
} from "../../states/Actors/SongActor";
import { useGlobalContext } from "../../states/Contet";
import "./SongBar.css";

const SongBar = () => {
    const [songs, setSongs] = useState([]);
    const [volume, setVolume] = useState(50);
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

    const handleMaster = () => {
        dispatch(isPlaying ? pauseMaster() : playMaster());
    };

    const changeProgress = (e) => {
        const newProgress = e.target.value;
        setProgress(newProgress);
        masterSong.mp3.currentTime = (newProgress / 100) * masterSong.mp3.duration;
    };

    const changeVolume = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        masterSong.mp3.volume = newVolume / 100;
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.round(time % 60);
        return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const changeSong = (direction) => {
        if (!songs.length) return;
    
        let newIndex = (songIdx + direction + songs.length) % songs.length; // Loop logic
    
        resetEverything();
        masterSong?.mp3.pause();
        setSongIdx(newIndex);
        dispatch(playSong(songs[newIndex]));
    };
    

    if (!isLoggedIn) return null;

    return (
        <div className="fixed w-full flex px-2 items-center justify-between bottom-0 left-0 h-20 bg-red-500">
            <div className="w-2/12 flex items-center gap-2">
                <img src={masterSong?.img || "/assets/default.jpg"} alt="" className="h-12" />
                <div>
                    <h3 className="text-xs font-medium">{masterSong?.title || "Unknown"}</h3>
                    <span className="text-[10px]">{masterSong?.artist || "Unknown"}</span>
                </div>
                <AiOutlineHeart className="cursor-pointer hover:text-green-400" />
            </div>

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
