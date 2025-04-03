import { createContext, useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { userActor } from "./Actors/UserActor";
import { toast } from "react-toastify";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currTime, setCurrTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [progress, setProgress] = useState(0);
  const [songIdx, setSongIdx] = useState(0);
  const [allSongs, setAllSongs] = useState([]); 
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const dispatch = useDispatch();

  const resetEverything = () => {
    setProgress(0);
    setCurrTime("00:00");
    setDuration("00:00");
    setSongIdx((prevstate) => prevstate + 1);
  };

  const getUser = async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const res = await fetch("http://localhost:8080/api/user/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token,
        },
      });
      const data = await res.json();
      if (data.success) {
        dispatch(userActor(data.user));
      } else {
        toast.error(data.message);
      }
    }
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/songs") 
      .then((res) => res.json())
      .then((data) => {
        setAllSongs(data.songs || []);
        setFilteredSongs(data.songs || []);
      })
      .catch((err) => console.error(" Error fetching songs:", err));
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSongs(allSongs); 
    } else {
      setFilteredSongs(
        allSongs.filter(song =>
          song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, allSongs]);

  return (
    <AppContext.Provider
      value={{
        currTime,
        setCurrTime,
        duration,
        setDuration,
        progress,
        setProgress,
        resetEverything,
        songIdx,
        setSongIdx,
        getUser,
        filteredSongs,
        setSearchTerm, 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
