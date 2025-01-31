import { useEffect, useState } from "react";
import { BiSolidHome, BiLibrary } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Import authentication context

import "./Sidebar.css";

const Sidebar = () => {
  const [playlists, setPlaylists] = useState([]);
  const { user } = useAuth(); // Get authenticated user
  const isAdmin = user?.email === "admin@gmail.com"; // Check if admin

  const getPlaylists = async () => {
    const res = await fetch("http://137.184.81.218:5173/api/playlist/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let d = await res.json();
    setPlaylists(d.playlists);
  };

  useEffect(() => {
    getPlaylists();
  }, []);

  return (
    <div className="w-1/4 fixed left-0 mt-2 top-0 sidebar">
      <div className="nav bg-primary rounded-lg p-6">
        <Link to={"/"} className="flex items-center gap-6">
          <BiSolidHome className="font-bold text-2xl text-red-500" />
          <span className="text-lg text-red-500">Home</span>
        </Link>
        <Link to={"/search"} className="flex mt-4 items-center text-red-500 gap-6">
          <FiSearch className="font-bold text-2xl" />
          <span className="text-lg">Search</span>
        </Link>
      </div>

      <div className="mt-2 bg-primary rounded-lg px-2 py-2">
        <div className="flex px-4 justify-between mb-4 items-center gap-4">
          <div className="flex gap-2 items-center">
            <BiLibrary className="font-bold text-red-500 text-xl" />
            <span className="text-red-500">Your library</span>
          </div>
          <button className="hover:bg-black/25 text-red-500 rounded-[50%] p-2">
            <FaPlus className="font-bold text-red-500 text-xl" />
          </button>
        </div>

        <div className="btns flex text-red-500 gap-4 mb-4">
          <Link to={"/"} className="rounded-full mt-4 px-3 py-1 bg-white/10 text-red-500 text-sm">
            Playlists
          </Link>
          <Link to={"/"} className="rounded-full mt-4 px-3 py-1 bg-white/10 text-red-500 text-sm">
            Artists
          </Link>
        </div>

        <div className="my-6 px-2">
          {playlists.map((p) => (
            <div key={p._id} className="flex text-red-500 gap-4 my-2">
              <div>
                <img src="/assets/Arijit-1.jpg" width={50} height={50} alt="" />
              </div>
              <div>
                <h3 className="text-base font-medium mb-2">{p.title}</h3>
                <p className="text-sm text-red-500">
                  Playlist <span> . {p.songs.length} Songs</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Conditionally Render Buttons */}
        <div className="your_library">
          <div className="leading-8 mt-2 white_bg text-red-500 rounded-lg py-6 px-4">
            {isAdmin ? (
              <>

                <p className="font-bold text-red-500">Admin Panel</p>
                <p className="font-semibold text-red-500">Manage songs easily</p>
                <Link to="/add-song">
                  <button className="rounded-full text-white mt-4 px-4 py-0 bg-red-500 font-semibold">
                    Add Songs
                  </button>
                </Link>
              </>
            ) : (
              <>
                <p className="font-bold text-red-500">Create your first playlist</p>
                <p className="font-semibold text-red-500">It's easy, we'll help you</p>
                <button className="rounded-full text-white mt-4 px-4 py-0 bg-red-500 font-semibold">
                  Create Playlist
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 px-4 flex gap-4 flex-wrap">
        <a className="text-xs text-red-500 mx-4" href="#">Legal</a>
        <a className="text-xs text-red-500 mx-4" href="#">Privacy Center</a>
        <a className="text-xs text-red-500 mx-4" href="#">Privacy Policy</a>
        <a className="text-xs text-red-500 mx-4" href="#">Cookies</a>
        <a className="text-xs text-red-500 mx-4" href="#">About Ads</a>
        <a className="text-xs text-red-500 mx-4" href="#">Accessibility</a>
      </div>

      <button className="mx-4 mt-12 text-sm border-red-500 border rounded-full flex gap-2 px-3 py-1 items-center text-red-500">
        <TbWorld />
        <span className="text-red font-bold">English</span>
      </button>
    </div>
  );
};

export default Sidebar;
