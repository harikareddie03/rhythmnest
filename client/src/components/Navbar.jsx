import { useState, useCallback, useEffect } from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../states/Contet";
import { logOutUser } from "../states/Actors/UserActor";
import debounce from "lodash.debounce";

import logo from "../assets/rythmnest1.jpeg"; 
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const { isAuthenticated } = useSelector((state) => state.account);
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropDown, setShowDropDown] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => JSON.parse(localStorage.getItem("isDarkMode")) || false
  );
  const { user } = useAuth();  
  const isLoggedIn = !!user; 

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/songs");
        const data = await response.json();
        console.log("Fetched songs1:", data.songs);
        setSongs(data.songs || []); 
      } catch (error) {
        console.error("Error fetching songs:", error.message);
      }
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    console.log("Fetched songs2:", songs);
  }, [songs]);
  
  const debouncedFilterSongs = useCallback(
    debounce((value, songsList = []) => { 
      if (!Array.isArray(songsList) || songsList.length === 0) return; 
  
      const filtered = songsList.filter((song) =>
        song.title.toLowerCase().includes(value.toLowerCase()) ||
        song.artist.toLowerCase().includes(value.toLowerCase())
      );
  
      console.log("Filtered Songs1:", filtered);
      setFilteredSongs(filtered);
    }, 300),
    [songs] 
  );
  
  
  useEffect(() => {
    console.log("Filtered Songs2:", filteredSongs);
  }, [filteredSongs]);
  
  const filterSongs = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFilterSongs(value, songs); 
  };
  

  const logoutUser = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.location.reload();
    toast.success("loggedout successfully");
    navigate("/");
    dispatch(logOutUser());
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      document.documentElement.classList.add("dark"); 
    } else {
      document.body.classList.remove("dark-mode");
      document.documentElement.classList.remove("dark"); 
    }
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);


  return (
    <header className={`flex sticky top-0 z-50 justify-between ml-2 rounded-[6px] mt-2 px-8 items-center 
    ${isDarkMode ? "bg-black text-white" : "bg-white text-black"} transition-all duration-300`}
    >

      <div className="flex gap-2 items-center"></div>
      
      <div className="flex items-center w-1/3">
        <img src={logo} alt="Logo" className="w-13 h-16 mr-5 rounded-full" />
        <span className="text-red-500 text-3xl font-bold">RhythmNest</span>
      </div>

      

      <div className="flex items-center w-1/3 justify-end">
        {!isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Link
              to={"/signup"}
              className="rounded-full mt-4 px-8 text-base py-2 text-red-500 font-semibold"
            >
              Sign Up
            </Link>
            <Link
              to={"/login"}
              className="rounded-full text-black mt-4 px-8 py-3 bg-red-500 font-semibold"
            >
              Log In
            </Link>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowDropDown((prev) => !prev)}
              aria-label="User Menu"
              className="text-red-500"
            >
              <FaUser />
            </button>
            {showDropDown && (
              <div className="absolute dropdown bg-[#282828] dark:bg-gray-800 top-8 text-sm right-0 w-[12rem]">
                <ul className="p-1">
                  <li>
                    <Link
                      className="flex p-2 justify-between text-white hover:bg-white/10"
                      to={"/profile"}
                      aria-label="Profile"
                    >
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={toggleDarkMode}
                      className="flex items-center gap-2 p-2 rounded bg-gray-800 dark:bg-gray-800 text-white dark:text-white"
                    >
                      {isDarkMode ? (
                        <>
                          <span className="text-sm">Dark Mode</span>
                          <div className="w-6 h-3 bg-gray-700 rounded-full relative">
                            <div className="w-3 h-3 bg-white rounded-full absolute top-0 left-3 transition-transform"></div>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-sm">Light Mode</span>
                          <div className="w-6 h-3 bg-gray-300 rounded-full relative">
                            <div className="w-3 h-3 bg-black rounded-full absolute top-0 left-0 transition-transform"></div>
                          </div>
                        </>
                      )}
                    </button>

                  </li>
                  <li>
                    <button
                      onClick={logoutUser}
                      className="p-2 w-full text-left text-white border-t border-white/10 hover:bg-white/10"
                      aria-label="Log out"
                    >
                      <span>Log out</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
