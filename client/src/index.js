import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import "./App.css"; // Ensure styles are applied

ReactDOM.render(
    <AuthProvider>  {/* Wrap AuthProvider at the highest level */}
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </AuthProvider>,
    document.getElementById("root")
);
