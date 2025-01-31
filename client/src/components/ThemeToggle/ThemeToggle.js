import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext"; // Adjust the path

const ThemeToggle = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
        >
            {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        </button>
    );
};

export default ThemeToggle;
