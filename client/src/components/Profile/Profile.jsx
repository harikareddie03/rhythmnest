import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./profile.css";

const Profile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const navigate = useNavigate();

    // Fetch user details on component mount
    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = JSON.parse(localStorage.getItem("token"));

            if (!token) {
                toast.error("Please log in to view your profile.");
                navigate("/login");
                return;
            }

            try {
                const res = await fetch("http://localhost:8080/api/user/profile", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (data.success) {
                    setUserDetails(data.user);
                } else {
                    toast.error(data.message);
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            } catch (error) {
                toast.error("Failed to fetch profile data. Please try again later.");
            }
        };

        fetchUserDetails();
    }, [navigate]);

    // Update the state as user types in fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    // Save changes and update the backend
    const handleSaveChanges = async () => {
        const token = JSON.parse(localStorage.getItem("token"));

        try {
            const res = await fetch("http://localhost:8080/api/user/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(userDetails),
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Profile updated successfully!");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to update profile. Please try again later.");
        }
    };

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("Logged out successfully!");
        navigate("/login");
    };

    // Render loading state if data hasn't been fetched yet
    if (!userDetails) {
        return (
            <div className="loading">
                <h2>Loading your profile...</h2>
            </div>
        );
    }

    // JSX rendering the profile page
    return (
        <div className="profile-page bg-gray-100 py-8">
            {/* Profile Header */}
            <div className="profile-header bg-red-500 text-center py-8 w-full">
                <div className="profile-avatar mx-auto bg-white rounded-full w-24 h-24 flex items-center justify-center">
                    <span className="text-gray-500 text-4xl">👤</span>
                </div>
                <h1 className="text-2xl font-bold mt-4">{userDetails.username}</h1>
                <p className="text-sm">{userDetails.email}</p>
            </div>

            {/* Profile Form */}
            <div className="profile-form bg-white shadow-md rounded-md w-11/12 md:w-2/3 lg:w-1/2 mx-auto mt-6 p-6">
                <div className="form-group mb-4">
                    <label className="block text-sm font-semibold mb-2" htmlFor="username">
                        Full Name
                    </label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        value={userDetails.username}
                        onChange={handleInputChange}
                        className="w-full border text-black border-gray-300 p-2 rounded-md"
                    />
                </div>

                <div className="form-group mb-4">
                    <label className="block text-sm font-semibold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={userDetails.email}
                        onChange={handleInputChange}
                        className="w-full border text-black border-gray-300 p-2 rounded-md"
                    />
                </div>

                <div className="form-group mb-4">
                    <label className="block text-sm font-semibold mb-2" htmlFor="phone">
                        Phone Number
                    </label>
                    <input
                        id="phone"
                        type="text"
                        name="phone"
                        value={userDetails.phone || ""}
                        onChange={handleInputChange}
                        className="w-full border text-black border-gray-300 p-2 rounded-md"
                    />
                </div>

                <div className="form-group mb-4">
                    <label className="block text-sm font-semibold mb-2" htmlFor="gender">
                        Gender
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="M"
                                checked={userDetails.gender === "M"}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            Male
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="F"
                                checked={userDetails.gender === "F"}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            Female
                        </label>
                    </div>
                </div>

                {/* Save Changes Button */}
                <div className="text-center mt-6">
                    <button
                        onClick={handleSaveChanges}
                        className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Logout Button */}
            <div className="text-center mt-6">
                <button
                    onClick={handleLogout}
                    className="py-2 px-6 bg-gray-700 text-white rounded-md hover:bg-gray-800"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Profile;
