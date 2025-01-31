// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App'
// import './index.css'
// import { AuthProvider } from "./context/AuthContext";

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   <AuthProvider>
//     <App />
//   </AuthProvider>,
//   document.getElementById("root")
// )

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// // import { BrowserRouter } from 'react-router-dom';
// import './index.css'
// import App from './App.jsx';
// import { AuthProvider } from './context/AuthContext'; // Ensure this path is correct

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     {/* <BrowserRouter> */}
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//     {/* </BrowserRouter> */}
//   </React.StrictMode>
// );



import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import './styles.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <AuthProvider>
      <App />
    </AuthProvider>

  </React.StrictMode>
);
