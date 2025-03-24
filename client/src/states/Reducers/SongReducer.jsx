import {
    PLAY_SONG_REQUEST,
    PAUSE_SONG_REQUEST,
    PLAY_MASTER,
    PAUSE_MASTER,
    SEARCH_SONGS,
} from "../Contants/SongConstant";

const initialState = {
    songsList: [],
};

export const songReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SEARCH_SONGS_REQUEST":
    return { ...state, loading: true };  // Optional: Show loading indicator

case SEARCH_SONGS:
    return { ...state, songsList: action.payload, loading: false };

case "SEARCH_SONGS_ERROR":
    return { ...state, loading: false, error: action.payload };

        case PLAY_SONG_REQUEST:
            // console.log("✅ Reducer - PLAY_SONG_REQUEST:", action.payload); 
            return { 
                ...state, 
                masterSong: { ...action.payload, id: action.payload._id, isPlaying: true }, 
                isPlaying: true 
            };
        
        case PAUSE_SONG_REQUEST:
            return { 
                ...state, 
                masterSong: state.masterSong 
                    ? { ...state.masterSong, isPlaying: false } 
                    : null, // 🛠 Ensure masterSong is not null
                isPlaying: false
            };

        case PLAY_MASTER:
            return { 
                ...state, 
                isPlaying: true,
                masterSong: state.masterSong 
                    ? { ...state.masterSong, isPlaying: true } 
                    : null  // 🛠 Keep masterSong in sync
            };

        case PAUSE_MASTER:
            return { 
                ...state, 
                isPlaying: false,
                masterSong: state.masterSong 
                    ? { ...state.masterSong, isPlaying: false } 
                    : null  // 🛠 Ensure masterSong is updated
            };

        default:
            return state;
    }
};
