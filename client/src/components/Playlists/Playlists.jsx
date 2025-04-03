import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { saveLastVisitedPage } from "../../../utils/sessionUtils";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      saveLastVisitedPage();  
      navigate("/login-prompt");
      return;
    }

    let isMounted = true;
    fetch("http://localhost:8080/api/playlist/all")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          console.log("API Response:", data);
          setPlaylists(Array.isArray(data.playlists) ? data.playlists : []);
        }
      })
      .catch((err) => console.error(" Error fetching playlists:", err));

    return () => { isMounted = false; };
}, [user, navigate]);


  if (!user) return null; 

  return (
    <div className="p-6">
      <h2 className="text-4xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
        🎵 Your Playlists 🎶
      </h2>
      <div className="w-24 h-1 bg-blue-500 mx-auto mb-4 rounded-full"></div>

      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              className="bg-slate-100 p-4 rounded-2xl shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
              onClick={() => navigate(`/playlist/${playlist._id}`)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  🎶
                </div>
                <h3 className="mt-3 text-lg font-semibold text-gray-800">{playlist.title}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">No playlists found. 🎧</p>
      )}
    </div>
  );
};

export default Playlists;
