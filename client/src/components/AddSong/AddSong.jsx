import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const token = sessionStorage.getItem("token");

const AddSong = () => {
    const [songDetails, setSongDetails] = useState({
        title: "",
        artist: "",
        artistPhoto: null,
        songFile: null,
        audioPreview: null,
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSongDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];

        if (file) {
            setSongDetails((prev) => ({
                ...prev,
                [name]: file,
                ...(name === "songFile" ? { audioPreview: URL.createObjectURL(file) } : {}), // Add preview if it's a song
            }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", songDetails.title);
        formData.append("artist", songDetails.artist);
        formData.append("artistPhoto", songDetails.artistPhoto);
        formData.append("songFile", songDetails.songFile);

        console.log("Submitting song details with token:", token);

        try {
            const res = await fetch("http://localhost:8080/api/songs/add", {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${token}`, // Ensure Bearer format is used
                },
                credentials: "include",
            });

            if (!res.ok) {
                if (res.status === 401) {
                    toast.error("Unauthorized. Please log in again.");
                    console.error("401 Unauthorized. Token may be invalid or expired.");
                } else {
                    throw new Error("Failed to add song. Server responded with error.");
                }
            }

            const data = await res.json();
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
                    placeholder="Artist Name"
                    value={songDetails.artist}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                    required
                />

                {/* Choose Artist Photo */}
                <label className="block text-gray-700 font-semibold">Choose Artist Photo</label>
                <div className="flex items-center space-x-4">
                    <input
                        type="file"
                        name="artistPhoto"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="artistPhotoInput"
                        required
                    />
                    <label
                        htmlFor="artistPhotoInput"
                        className="bg-gray-200 px-4 py-2 rounded cursor-pointer hover:bg-gray-300"
                    >
                        Upload Photo
                    </label>
                    {songDetails.artistPhoto && (
                        <span className="text-gray-600">{songDetails.artistPhoto.name}</span>
                    )}
                </div>

                {/* Choose Song */}
                <label className="block text-gray-700 font-semibold">Choose Song</label>
                <div className="flex items-center space-x-4">
                    <input
                        type="file"
                        name="songFile"
                        accept="audio/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="songFileInput"
                        required
                    />
                    <label
                        htmlFor="songFileInput"
                        className="bg-gray-200 px-4 py-2 rounded cursor-pointer hover:bg-gray-300"
                    >
                        Upload Song
                    </label>
                    {songDetails.songFile && (
                        <span className="text-gray-600">{songDetails.songFile.name}</span>
                    )}
                </div>

                {/* Audio Preview */}
                {songDetails.audioPreview && (
                    <div className="mt-4">
                        <p className="font-bold">Preview:</p>
                        <audio controls src={songDetails.audioPreview} className="w-full mt-2" />
                    </div>
                )}

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