import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import { Provider } from "react-redux";
import store from "./states/store";
import { AppProvider } from "./states/Contet";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Search from "./components/Search/Search";
import SongBar from "./components/SongBar/SongBar";
import LoginPrompt from "./components/LoginPrompt/LoginPrompt";
import Profile from './components/Profile/Profile';
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"; 
import { AuthProvider } from "./context/AuthContext"; 
import AddSong from './components/AddSong/AddSong';
import CreatePlaylist from './components/CreatePlaylist/CreatePlaylist';
import PlaylistDetails from './components/PlaylistDetails/PlaylistDetails';
import Playlists from './components/Playlists/Playlists';

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/song-bar" element={<SongBar song={{ title: "", artist: "Artist" }} />} />
              <Route path="/login-prompt" element={<LoginPrompt />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/search" element={<Search />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/add-song" element={<AddSong />} />
              <Route path="/create-playlist" element={<CreatePlaylist/>}/>
              <Route path="/playlists" element={<Playlists />} />
        <Route path="/playlist/:id" element={<PlaylistDetails />} />
            </Routes>
          </Router>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </AppProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;
