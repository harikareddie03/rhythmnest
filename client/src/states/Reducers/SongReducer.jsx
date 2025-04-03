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
    return { ...state, loading: true };  

case SEARCH_SONGS:
    return { ...state, songsList: action.payload, loading: false };

case "SEARCH_SONGS_ERROR":
    return { ...state, loading: false, error: action.payload };

        case PLAY_SONG_REQUEST:
           
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
                    : null,
                isPlaying: false
            };

        case PLAY_MASTER:
            return { 
                ...state, 
                isPlaying: true,
                masterSong: state.masterSong 
                    ? { ...state.masterSong, isPlaying: true } 
                    : null
            };

        case PAUSE_MASTER:
            return { 
                ...state, 
                isPlaying: false,
                masterSong: state.masterSong 
                    ? { ...state.masterSong, isPlaying: false } 
                    : null  
            };

        default:
            return state;
    }
};
