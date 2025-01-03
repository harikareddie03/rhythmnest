// import { useState, useCallback } from "react";
// import {
//   FaAngleLeft,
//   FaAngleRight,
//   FaExternalLinkAlt,
//   FaSearch,
//   FaUser,
// } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { songs } from "./Home/Home";
// import { useGlobalContext } from "../states/Contet";
// import { logOutUser } from "../states/Actors/UserActor";
// import debounce from "lodash.debounce";

// // Import your logo image
// import logo from "../assets/rythmnest1.jpeg"; // Adjust the path as needed

// const Navbar = () => {
//   const { isAuthenticated } = useSelector((state) => state.account);
//   const location = useLocation();
//   const [query, setQuery] = useState("");
//   const { setFilteredSongs } = useGlobalContext();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [showDropDown, setShowDropDown] = useState(false);

//   const debouncedFilterSongs = useCallback(
//     debounce((value) => {
//       const fil = songs.filter((song) => {
//         return (
//           song.title.toLowerCase().includes(value.toLowerCase()) ||
//           song.artist.toLowerCase().includes(value.toLowerCase())
//         );
//       });
//       setFilteredSongs(value === "" ? [] : fil);
//     }, 300),
//     [setFilteredSongs]
//   );

//   const filterSongs = (e) => {
//     const value = e.target.value;
//     setQuery(value);
//     debouncedFilterSongs(value);
//   };

//   const logoutUser = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//     dispatch(logOutUser());
//   };

//   return (
//     <header className="flex sticky top-0 z-50 justify-between ml-2 rounded-[6px] mt-2 px-8 bg-primary items-center">
//       {/* Logo and Name Section */}
//       <div className="flex gap-2 items-center"></div>
//       <FaAngleLeft className="bg-white/10 text-3xl p-1 rounded-full" />
//       <FaAngleRight className="bg-white/10 text-3xl p-1 rounded-full" />
//       <div className="flex items-center w-1/3">
//         <img src={logo} alt="Logo" className="w-13 h-16 mr-5 rounded-full" />
//         {/* Adjust size as needed */}
//         <span className="text-red text-xl font-semibold">RhythmNest</span> {/* Adjust text styling as needed */}
//       </div>

//       <div className="flex gap-2 items-center w-1/2">
//         {/*   <FaAngleLeft className="bg-white/10 text-3xl p-1 rounded-full" />
//         <FaAngleRight className="bg-white/10 text-3xl p-1 rounded-full" /> */}
//         <div className={`${location.pathname !== "/search" ? "opacity-0" : ""} w-full text-left py-4 relative`}>
//           <input
//             type="text"
//             placeholder="Search"
//             autoComplete="off"
//             value={query}
//             onChange={filterSongs}
//             className="block w-full rounded-full pl-12 border-0 text-gray-300 shadow-sm ring ring-transparent placeholder:text-gray-400 focus:ring-3 focus:ring-inset focus:ring-white outline-none p-3 hover:ring-white/20 bg-[#1a1919]"
//           />
//           <FaSearch className="absolute left-4 top-8" />
//         </div>
//       </div>

//       <div className="flex items-center w-1/3 justify-end">
//         {!isAuthenticated ? (
//           <div className="flex items-center gap-4">
//             <Link
//               to={"/signup"}
//               className="rounded-full mt-4 px-8 text-base py-2 text-white font-semibold"
//             >
//               Sign Up
//             </Link>
//             <Link
//               to={"/login"}
//               className="rounded-full text-black mt-4 px-8 text-base py-3 bg-white font-semibold"
//             >
//               Log In
//             </Link>
//           </div>
//         ) : (
//           <div className="relative">
//             <button onClick={() => setShowDropDown((prev) => !prev)} aria-label="User Menu">
//               <FaUser />
//             </button>
//             {showDropDown && (
//               <div className="absolute dropdown bg-[#282828] top-8 text-sm right-0 w-[12rem]">
//                 <ul className="p-1">
//                   {/* <li>
//                     <Link
//                       className="flex p-2 justify-between hover:bg-white/10"
//                       to={"/account"}
//                       aria-label="Account"
//                     >
//                       <span>Account</span> <FaExternalLinkAlt />
//                     </Link>
//                   </li> */}
//                   <li>
//                     <Link
//                       className="flex p-2 justify-between hover:bg-white/10"
//                       to={"/account/profile"}
//                       aria-label="Profile"
//                     >
//                       <span>Profile</span>
//                     </Link>
//                   </li>
//                   {/* <li>
//                     <Link
//                       className="flex p-2 justify-between hover:bg-white/10"
//                       to={"/account/upgrade"}
//                       aria-label="Upgrade to Premium"
//                     >
//                       <span>Upgrade to Premium</span> <FaExternalLinkAlt />
//                     </Link>
//                   </li> */}
//                   <li>
//                     <Link
//                       className="flex p-2 justify-between hover:bg-white/10"
//                       to={"/account/settings"}
//                       aria-label="Settings"
//                     >
//                       <span>Settings</span>
//                     </Link>
//                   </li>
//                   <li>
//                     <button
//                       onClick={logoutUser}
//                       className="p-2 w-full text-left border-t border-white/10 hover:bg-white/10"
//                       aria-label="Log out"
//                     >
//                       <span>Log out</span>
//                     </button>
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Navbar;


import { useState, useCallback } from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaExternalLinkAlt,
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

const Navbar = () => {
  const { isAuthenticated } = useSelector((state) => state.account);
  const location = useLocation();
  const [query, setQuery] = useState("");
  const { setFilteredSongs } = useGlobalContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropDown, setShowDropDown] = useState(false);

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
    localStorage.removeItem("token");
    navigate("/login");
    dispatch(logOutUser());
  };

  return (
    <header className="flex sticky top-0 z-50 justify-between ml-2 rounded-[6px] mt-2 px-8 bg-white items-center">
      {/* Logo and Name Section */}
      <div className="flex gap-2 items-center"></div>
      <FaAngleLeft className="bg-white/10 text-3xl p-1 rounded-full" />
      <FaAngleRight className="bg-white/10 text-3xl p-1 rounded-full" />
      <div className="flex items-center w-1/3">
        <img src={logo} alt="Logo" className="w-13 h-16 mr-5 rounded-full" />
        {/* Adjust size as needed */}
        <span className="text-red-500 text-xl font-semibold">RhythmNest</span> {/* Adjust text styling as needed */}
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
          <FaSearch className="absolute left-4 top-8 text-red-500" /> {/* Search icon color red */}
        </div>
      </div>

      <div className="flex items-center w-1/3 justify-end">
        {!isAuthenticated ? (
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
              <div className="absolute dropdown bg-[#282828] top-8 text-sm right-0 w-[12rem]">
                <ul className="p-1">
                  <li>
                    <Link
                      className="flex p-2 justify-between hover:bg-white/10"
                      to={"/account/profile"}
                      aria-label="Profile"
                    >
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="flex p-2 justify-between hover:bg-white/10"
                      to={"/account/settings"}
                      aria-label="Settings"
                    >
                      <span>Settings</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logoutUser}
                      className="p-2 w-full text-left border-t border-white/10 hover:bg-white/10"
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
