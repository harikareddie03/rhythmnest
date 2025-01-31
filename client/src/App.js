import React from "react";
import ThemeToggle from "./components/ThemeToggle"; // Adjust the path
import './styles.css';


const App = () => {
    return (
        <div className="min-h-screen p-5">
            <h1 className="text-3xl text-center mb-5">React Theme Switcher</h1>
            <div className="flex justify-center">
                <ThemeToggle />
            </div>
        </div>
    );
};

export default App;
