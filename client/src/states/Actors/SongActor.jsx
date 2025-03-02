// import {
//     PLAY_SONG_REQUEST,
//     PAUSE_SONG_REQUEST,
//     PLAY_MASTER,
//     PAUSE_MASTER,
// } from "../Contants/SongConstant";

// // export const playSong = (song) => async (dispatch) => {
// //     dispatch({ type: PLAY_SONG_REQUEST, payload: song });
// // };
// export const playSong = (song) => async (dispatch) => {
//     if (!song.songUrl) {
//         console.error("No valid song URL!");
//         return;
//     }

//     const fullUrl = `http://localhost:8080${song.songUrl}`;  // Make sure this is the correct base URL

//     console.log("Full audio path:", fullUrl);

//     const audio = new Audio(fullUrl);  // Create an Audio object

//     dispatch({
//         type: PLAY_SONG_REQUEST,
//         payload: { 
//             ...song, 
//             mp3: audio,  // Attach the Audio object
//         },
//     });

//     // Auto-play the song
//     setTimeout(() => {
//         audio.play().catch((error) => console.error("Audio play error:", error));
//     }, 100);
// };

// export const pauseSong = () => async (dispatch) => {
//     dispatch({ type: PAUSE_SONG_REQUEST });
// };
// export const pauseMaster = () => async (dispatch) => {
//     dispatch({ type: PAUSE_MASTER });
// };
// export const playMaster = () => async (dispatch) => {
//     dispatch({ type: PLAY_MASTER });
// };
// export const searchSongs = (value) => async (dispatch) => {
    
//     dispatch({ type: PLAY_MASTER });
// };


import {
    PLAY_SONG_REQUEST,
    PAUSE_SONG_REQUEST,
    PLAY_MASTER,
    PAUSE_MASTER,
} from "../Contants/SongConstant";
export const playSong = (song) => async (dispatch, getState) => {
   
    console.log("🎵 SongActor.jsx - Attempting to play:", song);
if (!song || !song.songUrl) {
    console.error("🚨 SongActor.jsx - Missing song data!", song);
    return;
}

    const { masterSong } = getState().mainSong;
    
    if (masterSong?.mp3) {
        masterSong.mp3.pause();
        masterSong.mp3.currentTime = 0;
    }

    const fullUrl = `http://localhost:8080${song.songUrl}`;
    console.log("Full audio path:", fullUrl);

    const audio = new Audio(fullUrl);

    dispatch({
        type: PLAY_SONG_REQUEST,
        payload: { 
            ...song, 
            id: song.id,  // ✅ Ensure the song's original ID is used
            mp3: audio, 
            isPlaying: true, 
        },
    });

    setTimeout(() => {
        audio.play()
            .then(() => console.log("Playing:", song.id))
            .catch((error) => console.error("Audio play error:", error));
    }, 100);

    console.log("Redux State After Dispatch:", getState().mainSong);
};

export const pauseSong = () => async (dispatch, getState) => {
    const { masterSong } = getState().mainSong;

    if (masterSong?.mp3) {
        masterSong.mp3.pause(); // Pause the current song
    }

    dispatch({
        type: PAUSE_SONG_REQUEST,
        payload: { ...masterSong, isPlaying: false }, // Ensure only one song updates
    });
};

export const pauseMaster = () => async (dispatch) => {
    dispatch({ type: PAUSE_MASTER });
};
export const playMaster = () => async (dispatch) => {
    dispatch({ type: PLAY_MASTER });
};
export const searchSongs = (value) => async (dispatch) => {
    
    dispatch({ type: PLAY_MASTER });
};


