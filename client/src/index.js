import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import "./App.css"; 
ReactDOM.render(
    <AuthProvider>  
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </AuthProvider>,
    document.getElementById("root")
);
