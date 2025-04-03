import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const isLoggedIn = !!user;

    const login = (userData, token) => {
        console.log("AuthProvider: Logging in with user =", userData);
        setUser(userData);
        sessionStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.setItem("token", token);
    };

    const logout = () => {
        console.log("AuthProvider: Logging out");
        setUser(null);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
