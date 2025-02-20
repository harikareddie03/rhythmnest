import { createContext, useContext, useEffect, useState } from "react";
//import jwtDecode from "jwt-decode"; // Ensure you install jwt-decode with `npm install jwt-decode`
import { toast } from "react-toastify"; // Ensure you have react-toastify installed
import * as jwtDecode from "jwt-decode";
import { Navigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null; // Retrieve user details from sessionStorage
    });

    // Check token expiration on component mount
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        console.log("hii", token)
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 < Date.now()) {
                logout(); // Auto-logout if token is expired
                toast.info("Your session has expired. Please log in again.");
                

            }
        }
    }, []);

    // Sync user data with sessionStorage whenever user changes
    useEffect(() => {
        if (user) {
            sessionStorage.setItem("user", JSON.stringify(user));
        } else {
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token"); // Also clear token when logging out
        }
    }, [user]);

    // Login function that sets user and token in sessionStorage
    const login = (userData, token) => {
        setUser(userData);
        sessionStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.setItem("token", token); // Store token
    };

    // Logout function that clears sessionStorage
    const logout = () => {
        setUser(null);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using AuthContext
export const useAuth = () => useContext(AuthContext);
