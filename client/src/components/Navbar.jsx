import { useState, useCallback, useEffect } from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { songs } from "./Home/Home";
import { useGlobalContext } from "../states/Contet";
import { logOutUser } from "../states/Actors/UserActor";
import debounce from "lodash.debounce";

// Import your logo image
import logo from "../assets/rythmnest1.jpeg"; // Adjust the path as needed
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const { isAuthenticated } = useSelector((state) => state.account);
  const location = useLocation();
  const [query, setQuery] = useState("");
  const { setFilteredSongs } = useGlobalContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropDown, setShowDropDown] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => JSON.parse(localStorage.getItem("isDarkMode")) || false
  );
  const { user } = useAuth();  // Use user from AuthContext
  const isLoggedIn = !!user;   // Convert user object to boolean
  const debouncedFilterSongs = useCallback(
    debounce((value) => {
      const fil = songs.filter((song) => {
        return (
          song.title.toLowerCase().includes(value.toLowerCase()) ||
          song.artist.toLowerCase().includes(value.toLowerCase())
        );
      });
      setFilteredSongs(value === "" ? [] : fil);
    }, 300),
    [setFilteredSongs]
  );

  const filterSongs = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFilterSongs(value);
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
      document.documentElement.classList.add("dark"); // <-- Add this
    } else {
      document.body.classList.remove("dark-mode");
      document.documentElement.classList.remove("dark"); // <-- Remove this
    }
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);


  return (
    <header className={`flex sticky top-0 z-50 justify-between ml-2 rounded-[6px] mt-2 px-8 items-center 
    ${isDarkMode ? "bg-black text-white" : "bg-white text-black"} transition-all duration-300`}
    >

      {/* Logo and Name Section */}
      <div className="flex gap-2 items-center"></div>
      <FaAngleLeft className="bg-white/10 text-3xl p-1 rounded-full" />
      <FaAngleRight className="bg-white/10 text-3xl p-1 rounded-full" />
      <div className="flex items-center w-1/3">
        <img src={logo} alt="Logo" className="w-13 h-16 mr-5 rounded-full" />
        <span className="text-red-500 text-xl font-semibold">RhythmNest</span>
      </div>

      <div className="flex gap-2 items-center w-1/2">
        <div
          className={`${location.pathname !== "/search" ? "opacity-0" : ""
            } w-full text-left py-4 relative`}
        >
          <input
            type="text"
            placeholder="Search"
            autoComplete="off"
            value={query}
            onChange={filterSongs}
            className="block w-full rounded-full pl-12 border-0 text-gray-300 shadow-sm ring ring-transparent placeholder:text-gray-400 focus:ring-3 focus:ring-inset focus:ring-white outline-none p-3 hover:ring-white/20 bg-[#1a1919]"
          />
          <FaSearch className="absolute left-4 top-8 text-red-500" />
        </div>
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
              className="rounded-full text-black mt-4 px-8 text-white py-3 bg-red-500 font-semibold"
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
