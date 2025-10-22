import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLayout from "./layouts/user/userLayout.jsx";
import Login from "./layouts/user/login.jsx";
import Register from "./layouts/user/logup.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<UserLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
