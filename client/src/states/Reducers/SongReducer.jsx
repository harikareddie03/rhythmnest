// import {
//     PLAY_SONG_REQUEST,
//     PAUSE_SONG_REQUEST,
//     PLAY_MASTER,
//     PAUSE_MASTER,
// } from "../Contants/SongConstant";
// export const songReducer = (
//     state = { masterSong: {}, isPlaying: false },
//     action
// ) => {
//     switch (action.type) {
//         case PLAY_SONG_REQUEST:
//     return { 
//         ...state, 
//         masterSong: { ...action.payload, isPlaying: true }, 
//         isPlaying: true 
//     };

// case PAUSE_SONG_REQUEST:
//     return { 
//         ...state, 
//         masterSong: { ...state.masterSong, isPlaying: false }, // ✅ Fix here
//         isPlaying: false
//     };


//         case PLAY_MASTER:
//             return { ...state, isPlaying:true };
//         case PAUSE_MASTER:
//             return { ...state, isPlaying: false };
//         default:
//             return state;
//     }
// };

import {
    PLAY_SONG_REQUEST,
    PAUSE_SONG_REQUEST,
    PLAY_MASTER,
    PAUSE_MASTER,
} from "../Contants/SongConstant";

export const songReducer = (
    state = { masterSong: null, isPlaying: false }, // 🛠 Default masterSong to null
    action
) => {
    switch (action.type) {
        // case PLAY_SONG_REQUEST:
        //     console.log("✅ Reducer - PLAY_SONG_REQUEST:", action.payload);
        //     return { 
        //         ...state, 
        //         masterSong: { 
        //             ...action.payload, 
        //             id: action.payload.id || state.masterSong?.id, // 🛠 Ensure ID is always set
        //             isPlaying: true 
        //         }, 
        //         isPlaying: true 
        //     };
        case PLAY_SONG_REQUEST:
            console.log("✅ Reducer - PLAY_SONG_REQUEST:", action.payload); 
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
