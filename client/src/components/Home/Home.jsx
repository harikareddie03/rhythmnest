import Layout from "../../Layout/Layout";
import { FaAngleLeft, FaAngleRight, FaSearch, FaUser } from "react-icons/fa";
import Card from "../Card/Card";
import { Link } from "react-router-dom";
import SongBar from "../MasterBar/SongBar";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { userActor } from "../../states/Actors/UserActor";
import Navbar from "../Navbar";
import { useGlobalContext } from "../../states/Contet";
import Footer from "../Footer/Footer";
import { useEffect, useState } from "react";
const Home = () => {
  const { getUser } = useGlobalContext();
  const [songs, setSongs] = useState([]);

  const fetchUpdatedSongs = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/songs"); 
      const data = await res.json();

      if (data.success) {
        setSongs(data.songs);
      } else {
        console.error("Failed to fetch songs");
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  useEffect(() => {
    getUser();
    fetchUpdatedSongs();
  }, []);

  return (
    <Layout>
      <Navbar />

      <div className="bg-primary ml-2 px-4 py-4 home ">
        <div className="flex justify-between mb-4 pt-4 items-center">
          <span className="text-xl font-bold text-red-500 hover:underline cursor-pointer">
            Trending
          </span>
          <span className="text-red-500">Show All</span>
        </div>
        <div className="grid gap-6 grid-cols-5">
          {songs.map((song, idx) => (
  <Card key={song?._id || `song-${idx}`} song={song} idx={idx} />
))}

        </div>
        <div className="flex justify-between my-4 items-center">
          <span className="text-xl font-bold text-red-500 hover:underline cursor-pointer">
            RhythmNest List
          </span>
          <span className="text-red-500">Show All</span>
        </div>
        <div className="grid gap-6 grid-cols-5">
           {songs.map((song, idx) => (
  <Card key={song?._id || `song-${idx}`} song={song} idx={idx} />
))}

        </div>
      </div>
      <Footer />
      <SongBar />
    </Layout>
  );
};

export default Home; 