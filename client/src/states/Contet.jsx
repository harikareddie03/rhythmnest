import { createContext, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { userActor } from "./Actors/UserActor";
import { toast } from "react-toastify";

const AppContext = createContext();

// eslint-disable-next-line react/prop-types
export const AppProvider = ({ children }) => {
  const [currTime, setCurrTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [progress, setProgress] = useState(0);
  const [songIdx, setSongIdx] = useState(0);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const dispatch = useDispatch();
  const resetEverything = () => {
    setProgress(0);
    setCurrTime("00:00");
    setDuration("00:00");
    setSongIdx((prevstate) => prevstate + 1);
  };

  const getUser = async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const res = await fetch("http://137.184.81.218:5000/api/user/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token,
        },
      });
      const data = await res.json();
      if (data.success) {
        dispatch(userActor(data.user));
      } else {
        toast.error(data.message);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        currTime,
        setCurrTime,
        duration,
        setDuration,
        progress,
        setProgress,
        resetEverything,
        songIdx,
        setSongIdx,
        getUser,
        filteredSongs,
        setFilteredSongs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGlobalContext = () => {
  return useContext(AppContext);
};
// import { createContext, useContext, useState } from "react";
// import { useDispatch } from "react-redux";
// import { userActor } from "./Actors/UserActor";
// import { toast } from "react-toastify";
// import PropTypes from "prop-types";

// const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const [currTime, setCurrTime] = useState("00:00");
//   const [duration, setDuration] = useState("00:00");
//   const [progress, setProgress] = useState(0);
//   const [songIdx, setSongIdx] = useState(0);
//   const [filteredSongs, setFilteredSongs] = useState([]);
//   const dispatch = useDispatch();

//   const resetEverything = () => {
//     setProgress(0);
//     setCurrTime("00:00");
//     setDuration("00:00");
//     setSongIdx((prevstate) => prevstate + 1);
//   };

//   const getUser = async () => {
//     const token = sessionStorage.getItem("token");
//     console.log("local=", token)// Use plain string, not JSON.parse
//     if (token) {
//       try {
//         const res = await fetch("http://137.184.81.218:5000/api/user/me", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await res.json();
//         if (data.success) {
//           dispatch(userActor(data.user));
//         } else {
//           toast.error(data.message);
//         }
//       } catch (error) {
//         toast.error("Failed to fetch user data. Please try again.");
//         console.error("Fetch error:", error);
//       }
//     }
//   };

//   return (
//     <AppContext.Provider
//       value={{
//         currTime,
//         setCurrTime,
//         duration,
//         setDuration,
//         progress,
//         setProgress,
//         resetEverything,
//         songIdx,
//         setSongIdx,
//         getUser,
//         filteredSongs,
//         setFilteredSongs,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// AppProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export const useGlobalContext = () => {
//   return useContext(AppContext);
// };
