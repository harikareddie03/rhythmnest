import "./Card.css";
import { FaPause, FaPlay } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { pauseSong, playSong } from "../../states/Actors/SongActor";
import { useGlobalContext } from "../../states/Contet";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Card = ({ song, idx }) => {
  const { masterSong, isPlaying } = useSelector((state) => state.mainSong);
  const { resetEverything, setSongIdx } = useGlobalContext();
  const { isLoggedIn } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePlay = (song) => {
    console.log("Login status in Card.jsx:", isLoggedIn);

    if (!isLoggedIn) {
      console.log("Redirecting to login...");
      navigate("/login-prompt");
      return;
    }

    setSongIdx(idx);

    if (masterSong?.id === song.id && isPlaying) {
      console.log("Restarting the current song...");

      if (!masterSong?.mp3) {
        console.error("Audio object is undefined!");
        return;
      }

      masterSong.mp3.currentTime = 0;
      masterSong.mp3.play();
    } else {
      console.log("Playing a new song:", song);
      resetEverything();
      dispatch(playSong(song));
    }
  };


  const handlePause = () => {
    console.log("Pausing the song...");
    dispatch(pauseSong());
  };

  return (
    song && (
      <div className="card bg-white col-span-1 p-4 rounded-full">
        <div className="relative">
          <img
            src={song.img}
            className="w-full h-full object-cover rounded-full"
            alt={song.title}
          />
          {masterSong?.id === song.id && isPlaying ? (
            <button
              onClick={handlePause}
              className="flex items-center play_btn absolute bottom-2 right-2 rounded-full bg-red-500 justify-center p-3"
            >
              <FaPause className="text-black text-xl" />
            </button>
          ) : (
            <button
              onClick={() => handlePlay(song)}
              className="flex items-center play_btn absolute bottom-2 right-2 rounded-full bg-red-500 justify-center p-3"
            >
              <FaPlay className="text-black text-xl" />
            </button>
          )}
        </div>
        <h3 className="text-sm font-semibold my-2 text-red-500">
          {song.artist}
        </h3>
        <p className="text-xs text-red-500 leading-4 mb-8">
          {song.title} - {song.artist}
        </p>
      </div>
    )
  );
};

export default Card;
