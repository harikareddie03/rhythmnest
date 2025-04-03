

import {
    PLAY_SONG_REQUEST,
    PAUSE_SONG_REQUEST,
    PLAY_MASTER,
    PAUSE_MASTER,
    SEARCH_SONGS,
} from "../Contants/SongConstant";
export const playSong = (song) => async (dispatch, getState) => {
if (!song || !song.songUrl) {
    return;
}

    const { masterSong } = getState().mainSong;
    
    if (masterSong?.mp3) {
        masterSong.mp3.pause();
        masterSong.mp3.currentTime = 0;
    }

    const fullUrl = `http://localhost:8080${song.songUrl}`;
    const audio = new Audio(fullUrl);

    dispatch({
        type: PLAY_SONG_REQUEST,
        payload: { 
            ...song, 
            id: song._id, 
            mp3: audio, 
            isPlaying: true, 
        },
    });

    setTimeout(() => {
        audio.play()
            .then(() => console.log("Playing:", song._id))
            .catch((error) => console.error("Audio play error:", error));
    }, 100);

};

export const pauseSong = () => async (dispatch, getState) => {
    const { masterSong } = getState().mainSong;

    if (masterSong?.mp3) {
        masterSong.mp3.pause(); 
    }

    dispatch({
        type: PAUSE_SONG_REQUEST,
        payload: { ...masterSong, isPlaying: false },
    });
};

export const pauseMaster = () => async (dispatch) => {
    dispatch({ type: PAUSE_MASTER });
};
export const playMaster = () => async (dispatch) => {
    dispatch({ type: PLAY_MASTER });
};


export const searchSongs = (value) => async (dispatch) => {
    try {
        dispatch({ type: "SEARCH_SONGS_REQUEST" });
        
        const response = await fetch(`http://localhost:8080/api/songs?search=${value}`);
        
        if (!response.ok) {
            throw new Error("Failed to fetch songs");
        }

        const data = await response.json();

        dispatch({ type: SEARCH_SONGS, payload: data }); 

    } catch (error) {
        console.error("Error fetching songs:", error);
        dispatch({ type: "SEARCH_SONGS_ERROR", payload: error.message });
    }
};




