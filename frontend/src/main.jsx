// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import './index.css'

// import { BrowserRouter } from 'react-router-dom';

// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// 1. Import AuthProvider
import { AuthProvider } from "./context/AuthContext";

// 2. Import Router (nếu bạn dùng React Router ở đây)
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 3. Bọc AuthProvider ở cấp cao nhất (hoặc bên trong/ngoài Router đều được, miễn là bao Login) */}
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
