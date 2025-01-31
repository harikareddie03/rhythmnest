import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddSong = () => {
    const [songDetails, setSongDetails] = useState({
        title: "",
        artist: "",
        album: "",
        genre: "",
        audioFile: null,
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSongDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setSongDetails((prev) => ({ ...prev, audioFile: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", songDetails.title);
        formData.append("artist", songDetails.artist);
        formData.append("album", songDetails.album);
        formData.append("genre", songDetails.genre);
        formData.append("audioFile", songDetails.audioFile);

        // Debug: Log formData
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        try {
            const res = await fetch("http://localhost:8080/api/songs/add", {
                method: "POST",
                body: formData,
            });

            // Check if response is okay (status 200-299)
            if (!res.ok) {
                throw new Error("Failed to add song. Server responded with error.");
            }

            const data = await res.json();
            console.log(data); // Log the response to check the data structure

            if (data.success) {
                toast.success("Song added successfully!");
                navigate("/");
            } else {
                toast.error(data.message || "Failed to add song!");
            }
        } catch (error) {
            console.error("Error adding song:", error);
            toast.error(error.message || "Server error!");
        }
    };

    return (
        <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6">Add New Song</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    placeholder="Song Title"
                    value={songDetails.title}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                    required
                />
                <input
                    type="text"
                    name="artist"
                    placeholder="Artist"
                    value={songDetails.artist}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                    required
                />
                <input
                    type="text"
                    name="album"
                    placeholder="Album"
                    value={songDetails.album}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                />
                <input
                    type="text"
                    name="genre"
                    placeholder="Genre"
                    value={songDetails.genre}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                />
                <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="w-full p-3 border rounded"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
                >
                    Add Song
                </button>
            </form>
        </div>
    );
};

export default AddSong;
