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
  const [allSongs, setAllSongs] = useState([]);  // Store all songs
  const [filteredSongs, setFilteredSongs] = useState([]); // Store filtered songs
  const [searchTerm, setSearchTerm] = useState(""); // Store search input
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
      const res = await fetch("http://137.184.81.218:5000/api/user/me", {
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

  // 🎵 Fetch all songs once when the app loads
  useEffect(() => {
    fetch("http://localhost:8080/api/songs") // Replace with your actual API endpoint
      .then((res) => res.json())
      .then((data) => {
        setAllSongs(data.songs || []);
        setFilteredSongs(data.songs || []);
      })
      .catch((err) => console.error("❌ Error fetching songs:", err));
  }, []);

  // 🔍 Filter songs based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSongs(allSongs); // Reset to all songs if no search term
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
        setSearchTerm, // Add this function so the search bar can use it
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
