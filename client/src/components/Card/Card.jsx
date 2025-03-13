
import "./Card.css";
import { FaPause, FaPlay } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { pauseSong, playSong } from "../../states/Actors/SongActor";
import { useGlobalContext } from "../../states/Contet";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Card = ({ song, idx }) => {
  const { masterSong, isPlaying } = useSelector(state => state.mainSong) || { masterSong: {}, isPlaying: false };
  const { resetEverything, setSongIdx } = useGlobalContext();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCurrentSongPlaying = isPlaying && masterSong?.id === song?._id;

  // console.log("🔍 Card.jsx - Received Redux State:", masterSong);
  // console.log("Card.jsx:", {
  //   isPlaying,
  //   masterSongId: masterSong?.id,
  //   songId: song?._id,
  //   isCurrentSongPlaying
  // });

  const handlePlay = () => {
    if (!user) {
      navigate("/login-prompt");
      return;
    }
  
    if (isCurrentSongPlaying) {
      dispatch(pauseSong());
    } else {
      if (masterSong?.mp3) {
        masterSong.mp3.pause();
      }
      resetEverything();
      setSongIdx(idx);
      dispatch(playSong(song));
    }
    // console.log(`Card ${song?._id}: isPlaying=${isPlaying}, masterSong.id=${masterSong?.id}, isCurrentSongPlaying=${isCurrentSongPlaying}`);
  };
  
  return (
    <div className="card col-span-1 p-4">
      <div className="relative">
        <img
          src={`http://localhost:8080${song?.img || song?.artistPhotoUrl}`}
          className="w-full h-100 object-cover"
          alt={song?.title}
        />
        <button
          onClick={handlePlay}
          className="flex items-center play_btn absolute bottom-2 right-2 rounded-full bg-red-500 justify-center p-3"
        >
          {isCurrentSongPlaying ? (
            <FaPause className="text-black text-xl" />
          ) : (
            <FaPlay className="text-black text-xl" />
          )}
        </button>
      </div>
      <h3 className="text-sm font-semibold my-2 text-red-500">{song?.artist}</h3>
      <p className="text-xs text-red-500 leading-4 mb-8">
        {song?.title} - {song?.artist}
      </p>
    </div>
  );
};

export default Card;


