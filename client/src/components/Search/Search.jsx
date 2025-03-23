import React from "react";
import Layout from "../../Layout/Layout";
import Navbar from "../Navbar";
import { useGlobalContext } from "../../states/Contet";
import Card from "../Card/Card";
import SongBar from "../MasterBar/SongBar";
import {
  FaSearch,
  FaUser,
} from "react-icons/fa";

const Search = () => {
  const { filteredSongs, setSearchTerm } = useGlobalContext(); // ✅ Correct placement inside the function

  return (
    <Layout>
      <Navbar />
      <div className="bg-primary mx-4 px-4 py-4 home">
        
        {/* Search Box with FaSearch Icon */}
        <div className="relative w-full mb-4">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
          <input
            type="text"
            placeholder="Search songs..."
            className="border p-2 pl-10 w-full bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Songs Grid */}
        <div className="grid gap-6 grid-cols-5">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song) => <Card key={song.id} song={song} />)
          ) : (
            <p className="text-white">No songs found.</p>
          )}
        </div>
      </div>
      <SongBar />
    </Layout>
  );
};

export default Search;
